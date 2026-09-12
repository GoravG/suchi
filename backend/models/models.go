package models

type FileEntry struct {
	Name       string `json:"name"`
	Type       string `json:"type"`
	Size       int64  `json:"size"`
	ModifiedAt string `json:"modifiedAt"`
}

type ListFilesResponse struct {
	Path    string      `json:"path"`
	Entries []FileEntry `json:"entries"`
}
