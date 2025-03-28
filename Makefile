##服务器安装pm2相关启动管理工具
.PHONY: init
init:
	sudo apt-get install npm&&\
sudo npm install pm2 -g&&\
sudo pm2 install pm2-logrotate&&\
pm2 set pm2-logrotate:retain 10&&\
pm2 conf pm2-logrotate


#https://gorm.io/zh_CN/gen/create.html
.PHONY: gorm
gorm:
	gentool -dsn "root:123456@tcp(localhost:3306)/m-atmob?charset=utf8mb4&parseTime=True&loc=Local" -outPath "./query" -outFile "gen.go" &&\
	easyjson -all ./model/user.gen.go


#golang  tidy
tidy:
	go mod tidy



# https://go-zero.dev/docs/tasks/installation/goctl
goctl-init:
	go install github.com/zeromicro/go-zero/tools/goctl@latest &&\
	goctl env check --install --verbose --force


goctl-tmpl:
	goctl template init --home ./tpl


# go http服务生成， style: snake case
# https://go-zero.dev/docs/tutorials/cli/overview
# 指定模块，针对handler 进行定制 , 需要指定 目标为对应的 mod 下
API_DIR:=./backend/etcdwebtool.api # api文件所在目录
TARGET_DIR= ./backend #代码输出目录
goctl-api-go:
	goctl api go -api ${API_DIR} -dir ${TARGET_DIR} --style go_zero --home=./tpl



# https://go-zero.dev/docs/tutorials/cli/rpc
# --client  是否生成客户端代码(default true)
# --multiple 是否生成多个 rpc 服务 (default false)
# --style   文件命名风格，详情可参考 文件风格
# --zrpc_out  输出目录
RPC_OUT:= ./example/rpc
PROTO_DIR:=./example/rpc/etc/user.proto
goctl-rpc-protoc:
	goctl rpc protoc ${PROTO_DIR} -v --go_out=${RPC_OUT}/types --go-grpc_out=${RPC_OUT}/types --zrpc_out=${RPC_OUT} --style go_zero -multiple=true




# 根据业务需求选择合适的 model 生成器，https://go-zero.dev/docs/tutorials/cli/model
# https://go-zero.dev/docs/tutorials/cli/model#goctl-model-pg-datasource-%E6%8C%87%E4%BB%A4
#URL:= "postgres://root:123456@127.0.0.1:5432/flow_tec_db?sslmode=disable"
#MODEL_DIR:= ./example/model
#SCHEMA:= 'sensor'
#TABLE:= "sensor_data"
#goctl-model-pg:
#	goctl model pg datasource --url=${URL} --schema=${SCHEMA} --table=${TABLE} --dir ${MODEL_DIR} --style go_zero



# 生成 Dockerfile 文件 https://go-zero.dev/docs/tutorials/cli/docker
# 注意生成的 Dockerfile 需要在项目目录里
# --go 主函数文件名称
# --exe 输出的可执行文件名称
# --port 需要暴露的端口号
goctl-dockerfile:
	goctl docker --go ./backend/etcdwebtool.go --exe etcdwebtool.bin --port 8888



