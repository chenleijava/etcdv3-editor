package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"github.com/ghodss/yaml"
	"github.com/zeromicro/go-zero/core/conf"
	"github.com/zeromicro/go-zero/core/hash"
	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/core/stringx"
	"github.com/zeromicro/go-zero/rest"
	"greet/internal/config"
	"greet/internal/handler"
	"greet/internal/svc"
	net "greet/net/codec/server"
	"io/ioutil"
	"log"
	"net/http"
)

var configFile = flag.String("baseconfig", "etc/greet-api.yaml", "the config file")

// TestGreetApi
// @Description:
type TestGreetApi struct {
	Name string `json:"name"`
	Host string `json:"host"`
	Port int32  `json:"port"`
}

// AABB
// @Description:
type AABB struct {
	rest.RestConf
}

// AABBSAT
// @Description:
func AABBSAT() {
	testGreetApi := &TestGreetApi{}
	bytes, _ := ioutil.ReadFile("etc/base-cfg.yml")
	err := yaml.Unmarshal(bytes, testGreetApi)
	if err != nil {
		log.Fatalf("load conf err: %s", err.Error())
	}

	log.Printf("testGreetApi:%s", testGreetApi.Name)

	var aabb AABB
	content, _ := ioutil.ReadFile(*configFile)
	_ = yaml.Unmarshal(content, &aabb)

	ab := &AABB{}
	conf.MustLoad(*configFile, ab)
	log.Printf("")
}

// main
//
//	@Description:
func main() {

	var id int
	flag.IntVar(&id, "id", 100, "这里是解释说明哦")
	flag.Usage()
	flag.Parse()

	//net
	go func() {
		net.EchoServer()
	}()

	logx.DisableStat()

	c := config.Config{}

	conf.MustLoad(*configFile, &c)
	restConf := c.RestConf

	logx.Infof("host:%s", c.Host)

	//init server
	server := rest.MustNewServer(restConf,
		rest.WithCors("http://example.com"),
	)

	//全局中间件
	server.Use(func(next http.HandlerFunc) http.HandlerFunc {
		return func(responseWriter http.ResponseWriter, request *http.Request) {
			header := responseWriter.Header()
			header.Add("Content-MD5", hash.Md5Hex(hash.Md5([]byte("123"))))
			header.Add("X-Middleware", "static-middleware")
			logx.Errorf("global middleware call >>>>")
			header.Add("X-Csrf-Token", stringx.Rand())
			next.ServeHTTP(responseWriter, request)
		}
	})

	//register routes handler
	handler.RegisterHandlers(server, svc.NewServiceContext(c))

	log.Printf("Starting server at %s:%d...\n", restConf.Host, restConf.Port)
	defer server.Stop()

	server.Start()
}

// Man
// @Description: simple extend test
type Man struct {
	Name string `json:"name"`
	Age  int32  `json:"age" yaml:"age" bson:"age"`
}

// Say
// @Description:
// @receiver man
func (man *Man) Say() {
	bytes, _ := json.Marshal(man)
	fmt.Printf("---> %s", string(bytes))
}

// Father
// @Description:
type Father struct {
	//simple extend
	Man
}

// Say
// @Description:  简单的继承
// @receiver father
func (father *Father) Say() {
	fmt.Printf("father object address : %p", father)
	//匿名变量的参数
	father.Name = "胖子"
	father.Age = 100
	father.Man.Say()

}

// testExtend
// @Description:
func testExtend() {
	var father Father
	father.Say()

	dog := &Dog{
		Name: "this is dog name",
	}
	fmt.Printf("dog :%p", dog)
	dog.Sing()
}

type Action interface {
	Sing()
	Game()
}

type Cat struct {
}

// Sing
// @Description: implements interface of Action
// @receiver cat
func (cat *Cat) Sing() {
	fmt.Printf("Cat is singing :%p", cat)
}

func (cat *Cat) Game() {
	fmt.Printf("Cat is singing :%p", cat)
}

// Dog
// @Description: Dog implements interface of Action
type Dog struct {
	Cat         //compose
	Name string `json:"name"`
}

func (dog *Dog) Sing() {
	fmt.Printf("dog is singing :%p \n", dog)
}

type Music struct {
	Age  int32  `json:"age"`
	Name string `json:"name"`
}

func (music *Music) DeepClone() *Music {
	//deep clone
	m := &Music{
		Age:  music.Age,
		Name: music.Name,
	}
	return m
}
