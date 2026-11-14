/**
 * 四象模型·DSH智能体 · Host 半。
 *
 * 本插件的业务能力全部在 Agent preset 侧（见 cordis.patch.yml 的 preset-four-images 行）；
 * 工作台页面、首页卡片与“开始分析”动作全部在 Client 半（client.js）。
 *
 * 这里保留一个空实现，只为让本包拥有一条 enabled 的 Loader entry，使
 * @deepseek-ai/dsh-client-modules 能扫描到 package.json 的 dsh.client 声明并
 * 提供 /plugins 下的客户端 bundle。它不注册任何服务、工具或会话插件，
 * 不改变 preset 组合与分析行为。
 */
export function apply() {}
