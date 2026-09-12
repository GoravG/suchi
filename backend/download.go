package main

import (
	"errors"
	"fmt"
	"net/http"
	"os"
)

func handleDownloadFile(w http.ResponseWriter, r *http.Request) {
	uiPath := r.URL.Query().Get("path")
	if uiPath == "" || uiPath == "/" {
		writeError(w, http.StatusBadRequest, errors.New("path required"))
		return
	}

	fsPath, err := resolveUIPath(uiPath)
	if err != nil {
		writeError(w, http.StatusBadRequest, err)
		return
	}

	info, err := os.Stat(fsPath)
	if err != nil {
		if os.IsNotExist(err) {
			writeError(w, http.StatusNotFound, errors.New("file not found"))
			return
		}
		writeError(w, http.StatusInternalServerError, err)
		return
	}
	if info.IsDir() {
		writeError(w, http.StatusBadRequest, errors.New("not a file"))
		return
	}

	f, err := os.Open(fsPath)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err)
		return
	}
	defer f.Close()

	w.Header().Set("Content-Disposition", contentDispositionAttachment(info.Name()))
	http.ServeContent(w, r, info.Name(), info.ModTime(), f)
}

func contentDispositionAttachment(filename string) string {
	return fmt.Sprintf(`attachment; filename=%q`, filename)
}
