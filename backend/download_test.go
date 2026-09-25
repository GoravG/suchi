package main

import (
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
)

func TestHandleDownloadFile(t *testing.T) {
	tempDir := setupTestEnvironment(t)
	defer os.RemoveAll(tempDir)

	t.Run("download valid file", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/files/download?path=/file1.txt", nil)
		w := httptest.NewRecorder()

		handleDownloadFile(w, req)

		res := w.Result()
		defer res.Body.Close()

		if res.StatusCode != http.StatusOK {
			t.Fatalf("expected status 200, got %d", res.StatusCode)
		}

		disp := res.Header.Get("Content-Disposition")
		if disp != `attachment; filename="file1.txt"` {
			t.Errorf("unexpected Content-Disposition: %q", disp)
		}

		body, err := io.ReadAll(res.Body)
		if err != nil {
			t.Fatalf("failed to read body: %v", err)
		}
		if string(body) != "hello world!\n" {
			t.Errorf("expected body 'hello world!\n', got %q", string(body))
		}
	})

	t.Run("download missing path parameter returns 400", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/files/download", nil)
		w := httptest.NewRecorder()

		handleDownloadFile(w, req)

		if w.Code != http.StatusBadRequest {
			t.Errorf("expected status 400, got %d", w.Code)
		}
	})

	t.Run("downloading directory returns 400", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/files/download?path=/docs", nil)
		w := httptest.NewRecorder()

		handleDownloadFile(w, req)

		if w.Code != http.StatusBadRequest {
			t.Errorf("expected status 400, got %d", w.Code)
		}
	})

	t.Run("downloading non existent file returns 404", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/files/download?path=/missing.bin", nil)
		w := httptest.NewRecorder()

		handleDownloadFile(w, req)

		if w.Code != http.StatusNotFound {
			t.Errorf("expected status 404, got %d", w.Code)
		}
	})

	t.Run("downloading with path traversal returns 400", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/files/download?path=../secret", nil)
		w := httptest.NewRecorder()

		handleDownloadFile(w, req)

		if w.Code != http.StatusBadRequest {
			t.Errorf("expected status 400, got %d", w.Code)
		}
	})
}
