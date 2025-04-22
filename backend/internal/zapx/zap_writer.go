package zapx

import (
	"fmt"
	"go.uber.org/zap/zapcore"
	"os"
	"runtime"
	"strconv"
	"strings"
	"time"

	"github.com/zeromicro/go-zero/core/logx"
	"go.uber.org/zap"
)

type ZapWriter struct {
	logger *zap.Logger
}

// GoroutineID 获取协程编号
func GoroutineID() string {
	buf := make([]byte, 64)
	n := runtime.Stack(buf, false)
	stack := string(buf[:n])
	id := strings.Split(stack, " ")[1]
	return id
}

func NewZapWriter() (logx.Writer, error) {
	workDir, _ := os.Getwd()
	workDir = workDir + "/"
	encoderConfig := zapcore.EncoderConfig{
		TimeKey:        "time",
		LevelKey:       "level",
		NameKey:        "logger",
		CallerKey:      "caller",
		MessageKey:     "msg",
		StacktraceKey:  "stacktrace",
		LineEnding:     zapcore.DefaultLineEnding,
		EncodeDuration: zapcore.StringDurationEncoder,

		// 自定义日志级别格式（添加颜色）
		EncodeLevel: func(l zapcore.Level, enc zapcore.PrimitiveArrayEncoder) {
			switch l {
			case zapcore.InfoLevel:
				enc.AppendString("\x1b[32m--[INFO]--\x1b[0m") // 绿色
			case zapcore.DebugLevel:
				enc.AppendString("\x1b[33m--[DEBUG]--\x1b[0m") // 绿色
			case zapcore.WarnLevel:
				enc.AppendString("\x1b[33m--[WARN]--\x1b[0m") // 黄色
			case zapcore.ErrorLevel:
				enc.AppendString("\x1b[31m--[ERROR]--\x1b[0m") // 红色
			default:
				enc.AppendString(l.String())
			}
		},

		// 绿色显示时间
		EncodeTime: func(t time.Time, enc zapcore.PrimitiveArrayEncoder) {
			enc.AppendString(fmt.Sprintf("\x1b[32m%s\x1b[0m", t.Format("2006-01-02 15:04:05.999999999")))
		},

		// 优化日志调用位置的编码方式
		EncodeCaller: func(caller zapcore.EntryCaller, enc zapcore.PrimitiveArrayEncoder) {

			t := strings.Split(caller.File, "/")

			var sb strings.Builder
			sb.WriteString("\x1b[32m")
			sb.WriteString(strings.Join(t[len(t)-3:], "/"))
			sb.WriteString(":")
			sb.WriteString(strconv.Itoa(caller.Line))
			sb.WriteString(" [goroutine:")
			sb.WriteString(GoroutineID())
			sb.WriteString("]\x1b[0m")
			//sb.WriteString(fmt.Sprintf(" \x1b[33m call-> %s \x1b[0m", caller.Function))
			enc.AppendString(sb.String())
		},
	}

	zapConfig := zap.Config{
		Level:            zap.NewAtomicLevelAt(zap.DebugLevel),
		Development:      false,
		Encoding:         "console",
		EncoderConfig:    encoderConfig,
		OutputPaths:      []string{"stdout"},
		ErrorOutputPaths: []string{"stderr"},
		// 添加采样配置，避免日志量过大
		Sampling: &zap.SamplingConfig{
			Initial:    100,
			Thereafter: 100,
		},
	}

	logger, _ := zapConfig.Build(
		zap.AddCaller(),
		zap.AddCallerSkip(3),
		zap.AddStacktrace(zapcore.ErrorLevel),
	)
	zap.ReplaceGlobals(logger)

	return &ZapWriter{
		logger: logger,
	}, nil
}

func (w *ZapWriter) Logger() *zap.Logger {
	return w.logger
}

func (w *ZapWriter) Alert(v interface{}) {
	w.logger.Error(fmt.Sprint(v))
}

func (w *ZapWriter) Close() error {
	return w.logger.Sync()
}

func (w *ZapWriter) Debug(v interface{}, fields ...logx.LogField) {
	w.logger.Debug(fmt.Sprint(v), toZapFields(fields...)...)
}

func (w *ZapWriter) Error(v interface{}, fields ...logx.LogField) {
	w.logger.Error(fmt.Sprint(v), toZapFields(fields...)...)
}

func (w *ZapWriter) Info(v interface{}, fields ...logx.LogField) {
	w.logger.Info(fmt.Sprint(v), toZapFields(fields...)...)
}

func (w *ZapWriter) Severe(v interface{}) {
	w.logger.Fatal(fmt.Sprint(v))
}

func (w *ZapWriter) Slow(v interface{}, fields ...logx.LogField) {
	w.logger.Warn(fmt.Sprint(v), toZapFields(fields...)...)
}

func (w *ZapWriter) Stack(v interface{}) {
	w.logger.Error(fmt.Sprint(v), zap.Stack("stack"))
}

func (w *ZapWriter) Stat(v interface{}, fields ...logx.LogField) {
	w.logger.Info(fmt.Sprint(v), toZapFields(fields...)...)
}

func toZapFields(fields ...logx.LogField) []zap.Field {
	zapFields := make([]zap.Field, 0, len(fields))
	for _, f := range fields {
		zapFields = append(zapFields, zap.Any(f.Key, f.Value))
	}
	return zapFields
}
