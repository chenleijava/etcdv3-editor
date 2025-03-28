package handler

import (
    "github.com/zeromicro/go-zero/rest/httpx"
    "net/http"
    "backend/render" //基于handler.tpl定制 模板定制 响应固定的结构数据
    {{.ImportPackages}}
)

func {{.HandlerName}}(svcCtx *svc.ServiceContext) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        {{if .HasRequest}}var req types.{{.RequestType}}
        if err := httpx.Parse(r, &req); err != nil {
            httpx.Error(w, err)
            return
        }{{end}}

        l := {{.LogicName}}.New{{.LogicType}}(r.Context(), svcCtx)
        {{if .HasResp}}resp, {{end}}err := l.{{.Call}}({{if .HasRequest}}&req{{end}})
        {{if .HasResp}}render.ResponseJson(w, resp, err){{else}}render.ResponseJson(w, nil, err){{end}}
    }
}