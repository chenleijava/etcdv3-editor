import {
  FileExcelOutlined,
  FileJpgOutlined,
  FileMarkdownOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FileWordOutlined,
  FileZipOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import { PageContainer, ProCard, StatisticCard } from '@ant-design/pro-components';
import { request } from '@umijs/max';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  theme,
  Tree,
  TreeDataNode,
} from 'antd';
import { EventDataNode } from 'rc-tree/lib/interface';
import React, { useEffect, useState } from 'react';

// 网络请求（假设的服务接口）
import { del, lists, put, save } from '@/services/etcd-web-tool/login';

// ACE 编辑器插件
import AceEditor from 'react-ace';

// 主题和模式导入
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/mode-ini';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-php';
import 'ace-builds/src-noconflict/mode-ruby';
import 'ace-builds/src-noconflict/mode-rust';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-toml';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-kuroir';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/theme-xcode';

const { Option } = Select;

interface ExtendedTreeDataNode extends TreeDataNode {
  originalKey?: string;
}

// 首先在文件顶部添加 theme 相关导入

const EtcdPage = () => {
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [format, setFormat] = useState<string>('yaml');
  const [metadata, setMetadata] = useState<any>({});
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  //编辑器主题
  const [ContentThem, setContentThem] = useState<string>('monokai');

  //文件树主题 token
  const { token } = theme.useToken();

  const buildTreeData = (keys: string[]): ExtendedTreeDataNode[] => {
    const map = new Map<string, ExtendedTreeDataNode>();

    // 创建根节点（可选，如果你希望显示所有顶级键）
    const root: ExtendedTreeDataNode = {
      title: 'Root',
      key: '',
      children: [],
      isLeaf: false,
      icon: <FolderOutlined />,
    };
    map.set('', root);

    keys.forEach((key) => {
      const parts = key.split('/').filter(Boolean); // 过滤空字符串
      let current = root;
      let path = '';

      if (parts.length === 0) {
        // 处理空键（理论上不常见）
        const node: ExtendedTreeDataNode = {
          title: key || '(empty)',
          key: key,
          originalKey: key,
          isLeaf: true,
          icon: <FileTextOutlined />,
        };
        map.set(key, node);
        current.children!.push(node);
      } else {
        parts.forEach((part, index) => {
          path = index === 0 && !key.startsWith('/') ? part : `${path}/${part}`;
          if (!map.has(path)) {
            const isLeaf = index === parts.length - 1;
            const node: ExtendedTreeDataNode = {
              title: part,
              key: path,
              originalKey: isLeaf ? key : undefined,
              children: isLeaf ? undefined : [],
              isLeaf,
              icon: isLeaf ? (
                (() => {
                  const ext = part.split('.').pop()?.toLowerCase();
                  switch (ext) {
                    case 'json':
                      return <FileTextOutlined style={{ color: '#f5222d' }} />;
                    case 'md':
                      return <FileMarkdownOutlined />;
                    case 'yaml':
                    case 'yml':
                      return <FileTextOutlined style={{ color: '#52c41a' }} />;
                    case 'txt':
                      return <FileTextOutlined />;
                    case 'xlsx':
                    case 'xls':
                      return <FileExcelOutlined />;
                    case 'zip':
                    case 'rar':
                    case '7z':
                      return <FileZipOutlined />;
                    case 'jpg':
                    case 'jpeg':
                    case 'png':
                    case 'gif':
                      return <FileJpgOutlined />;
                    case 'pdf':
                      return <FilePdfOutlined />;
                    case 'doc':
                    case 'docx':
                      return <FileWordOutlined />;
                    default:
                      return <FileTextOutlined />;
                  }
                })()
              ) : (
                <FolderOutlined />
              ),
            };
            map.set(path, node);
            current.children!.push(node);
          }
          current = map.get(path)!;
        });
      }
    });

    // 排序：文件夹在前，文件在后
    const sortChildren = (node: ExtendedTreeDataNode) => {
      if (node.children) {
        node.children.sort((a, b) => {
          if (a.isLeaf === b.isLeaf) {
            return (a.title as string).localeCompare(b.title as string);
          }
          return a.isLeaf ? 1 : -1;
        });
        node.children.forEach(sortChildren);
      }
    };
    sortChildren(root);

    return root.children || [];
  };

  //加载数据源
  const fetchTreeData = async () => {
    try {
      // 获取所有键值对，不限制前缀
      //@ts-ignore
      const { keys } = await lists({ params: { prefix: '/' } });
      const tree = buildTreeData(keys);
      setTreeData(tree);
    } catch (error) {
      message.error('获取键值对失败');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTreeData().then((r) => {});
  }, []);

  const onSelect = async (
    keys: React.Key[],
    info: {
      event: 'select';
      selected: boolean;
      node: EventDataNode<TreeDataNode>;
      selectedNodes: TreeDataNode[];
      nativeEvent: MouseEvent;
    },
  ) => {
    if (keys.length > 0 && info.node) {
      const selectedNode = info.node as ExtendedTreeDataNode;
      const originalKey = selectedNode.originalKey || keys[0].toString();
      setSelectedKey(originalKey);

      if (info.node.isLeaf) {
        const data = await request(`/api/etcd/get?key=${originalKey}`);
        setValue(data.value);

        const fileExtension = originalKey.split('.').pop()?.toLowerCase();
        if (fileExtension) {
          switch (fileExtension) {
            case 'yaml':
            case 'yml':
              setFormat('yaml');
              break;
            case 'java':
              setFormat('java');
              break;
            case 'toml':
              setFormat('toml');
              break;
            case 'json':
              setFormat('json');
              break;
            case 'sql':
              setFormat('sql');
              break;
            case 'go':
              setFormat('golang');
              break;
            default:
              setFormat('text');
              break;
          }
        }
        setMetadata({
          createRevision: data.createRevision,
          modRevision: data.modRevision,
          version: data.version,
          lease: data.lease,
        });
      }
    }
  };

  const onSave = async () => {
    try {
      if (format === 'json') {
        const parsed = JSON.parse(value);
        setValue(JSON.stringify(parsed, null, 2));
        message.success(`${selectedKey} 格式化成功`);
      }
      const data = await save({ key: selectedKey, value });
      if (data.success) {
        message.success(`${selectedKey} 保存成功`);
      }
    } catch (e) {
      message.error('保存失败');
    }
  };

  const onFormat = () => {
    if (format === 'json') {
      try {
        const parsed = JSON.parse(value);
        setValue(JSON.stringify(parsed, null, 2));
        message.success('格式化成功');
      } catch (e) {
        message.error('格式化失败');
      }
    } else if (format === 'yaml') {
      message.success('格式化成功'); // 可扩展 YAML 格式化逻辑
    }
  };

  const onAddText = () => {
    form.resetFields();
    setAddVisible(true);
  };

  const handleAddSubmit = async () => {
    const values = await form.validateFields();
    const displayKey = values.key;
    await put({ key: displayKey, value: values.value });
    message.success('添加成功');
    setAddVisible(false);
    await fetchTreeData();
  };

  const onEdit = () => {
    form.setFieldsValue({ key: selectedKey, value });
    setEditVisible(true);
  };

  const handleEditSubmit = async () => {
    const values = await form.validateFields();
    await put({ key: values.key, value: values.value });
    message.success('编辑成功');
    setEditVisible(false);
    await fetchTreeData();
    if (values.key === selectedKey) {
      setValue(values.value);
    }
  };

  const onDelete = () => {
    setDeleteVisible(true);
  };

  const handleDeleteConfirm = async () => {
    await del({ key: selectedKey });
    message.success('删除成功');
    setDeleteVisible(false);
    setSelectedKey('');
    setValue('');
    await fetchTreeData();
  };

  return (
    <PageContainer
      header={{
        title: 'Etcd V3 Editor',
        breadcrumb: {},
      }}
      style={{ height: '100vh', padding: '24px', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{ width: '25%', marginRight: '24px', overflow: 'auto' }}>
          <Button type="primary" onClick={onAddText} style={{ marginBottom: 16 }}>
            新增配置文件
          </Button>
          <ProCard
            title="ETCD V3 配置树"
            bodyStyle={{ padding: '12px' }}
            style={{
              boxShadow: `0 2px 8px ${token.colorBgElevated}`,
              borderRadius: token.borderRadius,
              background: token.colorBgContainer,
            }}
          >
            <Tree
              treeData={treeData}
              onSelect={onSelect}
              showLine={{ showLeafIcon: false }}
              showIcon
              defaultExpandAll
              blockNode
              style={{
                background: token.colorBgContainer,
                borderRadius: token.borderRadius,
                padding: '12px',
                boxShadow: `0 2px 8px ${token.colorBgElevated}`,
              }}
            />
          </ProCard>
        </div>
        <div style={{ width: '75%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <ProCard gutter={8} ghost style={{ marginBottom: 24 }}>
            <StatisticCard
              statistic={{
                title: '创建修订版本',
                value: metadata.createRevision || '-',
                valueStyle: { color: '#3f8600', fontSize: '16px' },
              }}
            />
            <StatisticCard
              statistic={{
                title: '修改修订版本',
                value: metadata.modRevision || '-',
                valueStyle: { color: '#1890ff', fontSize: '16px' },
              }}
            />
            <StatisticCard
              statistic={{
                title: '版本',
                value: metadata.version || '-',
                valueStyle: { color: '#722ed1', fontSize: '16px' },
              }}
            />
            <StatisticCard
              statistic={{
                title: '租约',
                value: metadata.lease || '-',
                valueStyle: { color: '#eb2f96', fontSize: '16px' },
              }}
            />
          </ProCard>

          <div
            style={{
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span>文件格式：</span>
              <Select value={format} onChange={setFormat} style={{ width: 120 }}>
                <Option value="yaml">YAML</Option>
                <Option value="json">JSON</Option>
                <Option value="ini">ini</Option>
                <Option value="javascript">JavaScript</Option>
                <Option value="java">Java</Option>
                <Option value="golang">Golang</Option>
                <Option value="sql">SQL</Option>
                <Option value="txt">TXT</Option>
                <Option value="toml">TOML</Option>
              </Select>
              <span>编辑器主题：</span>
              <Select value={ContentThem} onChange={setContentThem} style={{ width: 120 }}>
                <Option value="monokai">Monokai</Option>
                <Option value="github">GitHub</Option>
                <Option value="tomorrow">Tomorrow</Option>
                <Option value="kuroir">Kuroir</Option>
                <Option value="twilight">Twilight</Option>
                <Option value="xcode">XCode</Option>
                <Option value="textmate">TextMate</Option>
                <Option value="terminal">Terminal</Option>
              </Select>
            </div>
            <Space>
              <Button type="default" onClick={onFormat}>
                格式化
              </Button>
              <Button type="primary" onClick={onSave}>
                保存
              </Button>
              <Button type="default" onClick={onEdit}>
                编辑
              </Button>
              <Button danger onClick={onDelete}>
                删除
              </Button>
            </Space>
          </div>

          <AceEditor
            mode={format}
            theme={ContentThem}
            value={value}
            onChange={setValue}
            width="100%"
            height="calc(100vh - 350px)"
            style={{ marginBottom: 16 }}
            setOptions={{ useWorker: false }}
          />
        </div>
      </div>

      <Modal
        title="添加键值"
        open={addVisible}
        onOk={handleAddSubmit}
        onCancel={() => setAddVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="键"
            name="key"
            rules={[{ required: true, message: '请输入键，以 / 开始' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="值" name="value" rules={[{ required: true, message: '请输入值' }]}>
            <AceEditor
              mode={format}
              theme="monokai"
              width="100%"
              height="200px"
              setOptions={{ useWorker: false }}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑键值"
        open={editVisible}
        onOk={handleEditSubmit}
        onCancel={() => setEditVisible(false)}
        width={800}
        style={{ top: 20 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="键" name="key" rules={[{ required: true, message: '请输入键' }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="值" name="value" rules={[{ required: true, message: '请输入值' }]}>
            <AceEditor
              mode={format}
              theme={ContentThem}
              width="100%"
              height="400px"
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
                useWorker: false,
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="确认删除"
        open={deleteVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setDeleteVisible(false)}
        okText="删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除键 {selectedKey} 吗？</p>
      </Modal>
    </PageContainer>
  );
};

export default EtcdPage;
