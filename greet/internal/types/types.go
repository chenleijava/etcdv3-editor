// Code generated by goctl. DO NOT EDIT.
// goctl 1.8.1

package types

type Request struct {
	Name string `path:"name"`
	Age  int32  `path:"age"`
}

type Response struct {
	Message string   `json:"message"`
	Request *Request `json:"request"`
}
