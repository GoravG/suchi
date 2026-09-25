package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/goravg/suchi/models"
)

func setupTestEnvironment(t *testing.T) string {
	t.Helper()
	tempDir, err := os.MkdirTemp("", "suchi-test-*")
	if err != nil {
		t.Fatalf("failed to create temp dir: %v", err)
	}

	// Create test structure:
	// /
	//   file1.txt (13 bytes)
	//   docs/
	//     nested.pdf (10 bytes)
	if err := os.WriteFile(filepath.Join(tempDir, "file1.txt"), []byte("hello world!\n"), 0644); err != nil {
		t.Fatalf("failed to create test file: %v", err)
	}
	docsDir := filepath.Join(tempDir, "docs")
	if err := os.Mkdir(docsDir, 0755); err != nil {
		t.Fatalf("failed to create test dir: %v", err)
	}
	if err := os.WriteFile(filepath.Join(docsDir, "nested.pdf"), []byte("sample pdf"), 0644); err != nil {
		t.Fatalf("failed to create nested test file: %v", err)
	}

	dataRoot = tempDir
	return tempDir
}

func TestResolveUIPath(t *testing.T) {
	tempDir := setupTestEnvironment(t)
	defer os.RemoveAll(tempDir)

	tests := []struct {
		name    string
		uiPath  string
		wantErr bool
	}{
		{"root path", "/", false},
		{"subfolder path", "/docs", false},
		{"nested file path", "/docs/nested.pdf", false},
		{"relative root", "", false},
		{"path traversal parent", "../", true},
		{"path traversal deep", "/docs/../../etc/passwd", true},
		{"null byte injection", "/docs\x00file", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			fsPath, err := resolveUIPath(tt.uiPath)
			if (err != nil) != tt.wantErr {
				t.Fatalf("resolveUIPath(%q) error = %v, wantErr %v", tt.uiPath, err, tt.wantErr)
			}
			if !tt.wantErr && !underDataRoot(fsPath) {
				t.Errorf("fsPath %q is not under dataRoot %q", fsPath, tempDir)
			}
		})
	}
}

func TestNormalizeUIPath(t *testing.T) {
	tests := []struct {
		input    string
		expected string
	}{
		{"", "/"},
		{".", "/"},
		{"/", "/"},
		{"movies", "/movies"},
		{"/movies/action", "/movies/action"},
		{"/movies/action/", "/movies/action"},
		{"///movies///", "/movies"},
	}

	for _, tt := range tests {
		got := normalizeUIPath(tt.input)
		if got != tt.expected {
			t.Errorf("normalizeUIPath(%q) = %q, want %q", tt.input, got, tt.expected)
		}
	}
}

func TestHandleListFiles(t *testing.T) {
	tempDir := setupTestEnvironment(t)
	defer os.RemoveAll(tempDir)

	t.Run("list root directory", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/files?path=/", nil)
		w := httptest.NewRecorder()

		handleListFiles(w, req)

		res := w.Result()
		defer res.Body.Close()

		if res.StatusCode != http.StatusOK {
			t.Fatalf("expected status 200, got %d", res.StatusCode)
		}

		var out models.ListFilesResponse
		if err := json.NewDecoder(res.Body).Decode(&out); err != nil {
			t.Fatalf("failed to decode response: %v", err)
		}

		if out.Path != "/" {
			t.Errorf("expected path '/', got %q", out.Path)
		}
		if len(out.Entries) != 2 {
			t.Fatalf("expected 2 entries in root, got %d", len(out.Entries))
		}
	})

	t.Run("list subfolder", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/files?path=/docs", nil)
		w := httptest.NewRecorder()

		handleListFiles(w, req)

		res := w.Result()
		defer res.Body.Close()

		if res.StatusCode != http.StatusOK {
			t.Fatalf("expected status 200, got %d", res.StatusCode)
		}

		var out models.ListFilesResponse
		if err := json.NewDecoder(res.Body).Decode(&out); err != nil {
			t.Fatalf("failed to decode response: %v", err)
		}

		if len(out.Entries) != 1 || out.Entries[0].Name != "nested.pdf" {
			t.Errorf("expected 1 entry 'nested.pdf', got %+v", out.Entries)
		}
	})

	t.Run("non existent directory returns 404", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/files?path=/does-not-exist", nil)
		w := httptest.NewRecorder()

		handleListFiles(w, req)

		if w.Code != http.StatusNotFound {
			t.Errorf("expected status 404, got %d", w.Code)
		}
	})

	t.Run("path traversal returns 400", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/files?path=../", nil)
		w := httptest.NewRecorder()

		handleListFiles(w, req)

		if w.Code != http.StatusBadRequest {
			t.Errorf("expected status 400, got %d", w.Code)
		}
	})

	t.Run("listing a regular file returns 400", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/files?path=/file1.txt", nil)
		w := httptest.NewRecorder()

		handleListFiles(w, req)

		if w.Code != http.StatusBadRequest {
			t.Errorf("expected status 400, got %d", w.Code)
		}
	})
}
