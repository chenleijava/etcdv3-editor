package main

import (
	"flag"
	"fmt"
	"greet/net/codec/config"
	"log"
	"sync"
	"time"

	"github.com/panjf2000/gnet"
)

type codeClient struct {
	gnet.EventServer // simple implements EventHandler interface
	wg               sync.WaitGroup
}

func (cs *codeClient) OnInitComplete(server gnet.Server) (action gnet.Action) {
	return
}

func (cs *codeClient) OnShutdown(server gnet.Server) {
	return
}

func (cs *codeClient) OnOpened(c gnet.Conn) (out []byte, action gnet.Action) {
	log.Printf("connect opend:%s", c.RemoteAddr().String())
	return
}

func (cs *codeClient) OnClosed(c gnet.Conn, err error) (action gnet.Action) {
	log.Printf("OnClosed opend:%s", c.RemoteAddr().String())
	return
}

func (cs *codeClient) PreWrite(c gnet.Conn) {
	return
}

func (cs *codeClient) AfterWrite(c gnet.Conn, b []byte) {
	return
}

func (cs *codeClient) Tick() (delay time.Duration, action gnet.Action) {
	return
}

func (cs *codeClient) React(frame []byte, c gnet.Conn) (out []byte, action gnet.Action) {
	fmt.Println("received: ", string(frame))
	cs.wg.Done()
	return
}

func main() {
	var port int
	var count int

	// Example command: go run client.go --port 48567 --count 10
	flag.IntVar(&port, "port", 48567, "server port: --port 9000")
	flag.IntVar(&count, "count", 10, "message count")
	flag.Parse()
	addr := fmt.Sprintf("127.0.0.1:%d", port)

	codec := gnet.NewLengthFieldBasedFrameCodec(config.EncoderConfig, config.DecoderConfig)
	cs := &codeClient{wg: sync.WaitGroup{}}

	client, err := gnet.NewClient(
		cs,
		gnet.WithCodec(codec),
		gnet.WithTCPNoDelay(gnet.TCPNoDelay),
	)

	if err != nil {
		panic(err)
	}

	err = client.Start()
	if err != nil {
		panic(err)
	}

	conn, err := client.Dial("tcp", addr)
	if err != nil {
		panic(err)
	}

	defer func(c gnet.Conn) {
		err := c.Close()
		if err != nil {

		}
	}(conn)
	cs.wg.Add(count)
	for i := 0; i < count; i++ {
		err = conn.AsyncWrite([]byte("hello world-测试数据@@@@"))
		if err != nil {
			panic(err)
		}
	}
	cs.wg.Wait()
}
