package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/goravg/suchi/models"
)

var dataRoot string

func main() {
	dataRoot = os.Getenv("SUCHI_DATA_ROOT")
	if dataRoot == "" {
		dataRoot = "/data"
	}
	dataRoot = filepath.Clean(dataRoot)

	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/files", handleListFiles)
	mux.HandleFunc("GET /api/files/download", handleDownloadFile)
	mux.Handle("/", staticHandler())

	addr := os.Getenv("SUCHI_ADDR")
	if addr == "" {
		addr = ":8080"
	}

	log.Printf("suchi listening on %s (data root %s)", addr, dataRoot)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal(err)
	}
}

func handleListFiles(w http.ResponseWriter, r *http.Request) {
	uiPath := r.URL.Query().Get("path")
	if uiPath == "" {
		uiPath = "/"
	}

	fsPath, err := resolveUIPath(uiPath)
	if err != nil {
		writeError(w, http.StatusBadRequest, err)
		return
	}

	info, err := os.Stat(fsPath)
	if err != nil {
		if os.IsNotExist(err) {
			writeError(w, http.StatusNotFound, errors.New("path not found"))
			return
		}
		writeError(w, http.StatusInternalServerError, err)
		return
	}
	if !info.IsDir() {
		writeError(w, http.StatusBadRequest, errors.New("not a directory"))
		return
	}

	entries, err := os.ReadDir(fsPath)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err)
		return
	}

	out := models.ListFilesResponse{
		Path:    normalizeUIPath(uiPath),
		Entries: make([]models.FileEntry, 0, len(entries)),
	}

	for _, e := range entries {
		entryInfo, err := e.Info()
		if err != nil {
			continue
		}
		entryType := "file"
		size := entryInfo.Size()
		if entryInfo.IsDir() {
			entryType = "directory"
			size = 0
		}
		out.Entries = append(out.Entries, models.FileEntry{
			Name:       e.Name(),
			Type:       entryType,
			Size:       size,
			ModifiedAt: entryInfo.ModTime().UTC().Format(time.RFC3339),
		})
	}

	w.Header().Set("Content-Type", "application/json")
	enc := json.NewEncoder(w)
	enc.SetEscapeHTML(true)
	if err := enc.Encode(out); err != nil {
		log.Printf("encode response: %v", err)
	}
}

// resolveUIPath maps a UI path (e.g. "/", "/movies/foo") to a path under dataRoot.
func resolveUIPath(uiPath string) (string, error) {
	if strings.Contains(uiPath, "\x00") || strings.Contains(uiPath, "..") {
		return "", errors.New("invalid path")
	}

	normalized := normalizeUIPath(uiPath)

	rel := strings.TrimPrefix(normalized, "/")
	fsPath := filepath.Join(dataRoot, rel)
	fsPath = filepath.Clean(fsPath)

	if !underDataRoot(fsPath) {
		return "", errors.New("invalid path")
	}
	return fsPath, nil
}

func underDataRoot(absPath string) bool {
	absPath = filepath.Clean(absPath)
	if absPath == dataRoot {
		return true
	}
	sep := string(os.PathSeparator)
	return strings.HasPrefix(absPath, dataRoot+sep)
}

func normalizeUIPath(p string) string {
	p = filepath.ToSlash(filepath.Clean(p))
	if p == "." || p == "" {
		return "/"
	}
	if !strings.HasPrefix(p, "/") {
		p = "/" + p
	}
	return p
}

func writeError(w http.ResponseWriter, status int, err error) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
}
