package main

import (
	"embed"
	"io/fs"
	"net/http"
	"strings"
)

//go:embed static/*
var embeddedStatic embed.FS

func staticHandler() http.Handler {
	sub, err := fs.Sub(embeddedStatic, "static")
	if err != nil {
		panic(err)
	}
	fileServer := http.FileServer(http.FS(sub))

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet && r.Method != http.MethodHead {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		path := strings.TrimPrefix(r.URL.Path, "/")
		if path == "" {
			serveSPA(w, sub)
			return
		}

		if _, err := fs.Stat(sub, path); err != nil {
			serveSPA(w, sub)
			return
		}

		fileServer.ServeHTTP(w, r)
	})
}

func serveSPA(w http.ResponseWriter, fsys fs.FS) {
	data, err := fs.ReadFile(fsys, "index.html")
	if err != nil {
		http.Error(w, "frontend not built", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(data)
}
