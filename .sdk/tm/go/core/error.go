package core

type NotionError struct {
	IsNotionError bool
	Sdk              string
	Code             string
	Msg              string
	Ctx              *Context
	Result           any
	Spec             any
}

func NewNotionError(code string, msg string, ctx *Context) *NotionError {
	return &NotionError{
		IsNotionError: true,
		Sdk:              "Notion",
		Code:             code,
		Msg:              msg,
		Ctx:              ctx,
	}
}

func (e *NotionError) Error() string {
	return e.Msg
}
