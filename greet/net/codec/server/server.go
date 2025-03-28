package net

import (
	"flag"
	"fmt"
	"github.com/panjf2000/gnet/pkg/logging"
	"greet/net/codec/config"
	"log"
	"runtime"
	"time"

	"github.com/panjf2000/gnet"
	"github.com/panjf2000/gnet/pkg/pool/goroutine"
)

// codecEventServer
// @Description:  implements EventHandler
type codecEventServer struct {
	// EventServer is a built-in implementation of EventHandler which sets up each method with a default implementation,
	// you can compose it with your own implementation of EventHandler
	//when you don't want to implement all methods  in EventHandler.
	gnet.EventServer // simple extend , pick some method implements
	addr             string
	multicore        bool
	async            bool
	codec            gnet.ICodec
	workerPool       *goroutine.Pool
}

//gnet 目前支持的 I/O 事件如下：
//https://gnet.host/docs/v1.x/doc-for-gnet-v1-cn/#io-%E4%BA%8B%E4%BB%B6
//EventHandler.OnInitComplete 当 server 初始化完成之后调用。
//EventHandler.OnOpened 当连接被打开的时候调用。
//EventHandler.OnClosed 当连接被关闭的之后调用。
//EventHandler.React 当 server 端接收到从 client 端发送来的数据的时候调用。（你的核心业务代码一般是写在这个方法里）
//EventHandler.Tick 服务器启动的时候会调用一次，之后就以给定的时间间隔定时调用一次，是一个定时器方法。
//EventHandler.PreWrite 预先写数据方法，在 server 端写数据回 client 端之前调用。

// OnInitComplete fires when the server is ready for accepting connections.
// The parameter server has information and various utilities.
func (cs *codecEventServer) OnInitComplete(srv gnet.Server) (action gnet.Action) {
	log.Printf("Test config server is listening on %s (multi-cores: %t, NumEventLoop-event-loops: %d)\n",
		srv.Addr.String(), srv.Multicore, srv.NumEventLoop)
	return
}

// OnOpened fires when a new connection has been opened.
// The Conn c has information about the connection such as it's local and remote address.
// The parameter out is the return value which is going to be sent back to the peer.
// It is usually not recommended to send large amounts of data back to the peer in OnOpened.
//
// Note that the bytes returned by OnOpened will be sent back to the peer without being encoded.
func (cs *codecEventServer) OnOpened(c gnet.Conn) (out []byte, action gnet.Action) {
	log.Printf("OnOpened  remoteAddr:%s ", c.RemoteAddr().String())
	return
}

// OnClosed fires when a connection has been closed.
// The parameter err is the last known connection error.
func (cs *codecEventServer) OnClosed(c gnet.Conn, err error) (action gnet.Action) {
	log.Printf("connect closed remoteAddr:%s ", c.RemoteAddr().String())
	if err != nil {
		log.Printf("connect closed , happend err:%s", err.Error())
	}
	return
}

// React
// @Description:
// @receiver cs
// @param frame packet
// @param c  gnet.Conn
// @return out -- this []byte will be reused within event-loop after React() returns.
// @return action
func (cs *codecEventServer) React(frame []byte, c gnet.Conn) (out []byte, action gnet.Action) {
	fmt.Println("frame:", string(frame))

	//async-- logic
	if cs.async {

		//transfer new struck
		//copy data---> new goroutine

		//dst := make([]byte, len(frame))
		//copy(dst, frame)
		dst := append([]byte(c.RemoteAddr().String()+" "), frame...)

		//protobuf decoder

		//-----
		//protobuf encoder
		/// event-loop io encoder and decoder

		_ = cs.workerPool.Submit(func() {
			//logic --->
			err := c.AsyncWrite(dst)
			if err != nil {
				return
			}
		})

		//out:nil , action: default
		return
	}

	// if not async
	// Encode data and try to write it back to the peer, this attempt is based on a fact:
	// the peer socket waits for the response data after sending request data to the server,
	// which makes the peer socket writable.
	out = frame
	return
}

// codecServe
// @Description:
// @param addr
// @param multicore
// @param async
// @param codec
func codecServe(addr string, multicore, async bool, codec gnet.ICodec) {
	var err error
	if codec == nil {
		codec = gnet.NewLengthFieldBasedFrameCodec(config.EncoderConfig, config.DecoderConfig)
	}

	codeEventHandlerServer := &codecEventServer{
		addr:       addr,
		multicore:  multicore,
		async:      async,
		codec:      codec,
		workerPool: goroutine.Default(),
	}

	err = gnet.Serve(
		codeEventHandlerServer,
		addr,
		gnet.WithLogLevel(logging.InfoLevel),
		gnet.WithNumEventLoop(runtime.NumCPU()*2),
		gnet.WithMulticore(codeEventHandlerServer.multicore),
		gnet.WithTCPKeepAlive(time.Minute*5),
		gnet.WithCodec(codeEventHandlerServer.codec))

	if err != nil {
		panic(err)
	}
}

//SO_REUSEPORT 端口复用
//服务器支持 SO_REUSEPORT 端口复用特性，允许多个 sockets 监听同一个端口，然后内核会帮你做好负载均衡，
//每次只唤醒一个 socket 来处理 connect 请求，避免惊群效应。
//默认情况下，gnet 不会有惊群效应，因为 gnet 默认的网络模型是主从多 Reactors，只会有一个主 reactor 在监听端口以及接收新连接。
//所以，开不开启 SO_REUSEPORT 选项是无关紧要的，只是开启了这个选项之后 gnet 的网络模型将会切换成 evio 的旧网络模型，这一点需要注意一下。
//开启这个功能也很简单，使用 functional options 设置一下即可：

// EchoServer https://gnet.host/docs/v1.x/doc-for-gnet-v1-cn/#poll_opt-%E6%A8%A1%E5%BC%8F
// 关于优化
func EchoServer() {
	var port int
	//gnet 是否会使用多核来进行服务 true
	var multicore bool

	// Example command: go run server.go -port 48567 -multicore=true
	flag.IntVar(&port, "port", 48567, "server port")
	flag.BoolVar(&multicore, "multicore", true, "multicore")
	flag.Parse()
	//flag.Usage()

	addr := fmt.Sprintf("tcp://:%d", port)
	codecServe(addr, multicore, true, nil)
}
