/**
 * 四象模型·DSH智能体 · Client 半（plain JS，无构建步骤） · v1.5.0
 *
 * 定位：本插件是四象工作台的“扩展”——只向工作台注册自己的内容；
 * 与 skills 插件相互独立，不依赖、不读取、不写对方的状态。
 *
 * 注册内容：
 *   - fourImagesNavigation：导航项「四象分析」（id = agent）；
 *   - four-images.page：key = agent 的整页内容（六维速览、四阶段、提问方式、
 *     报告读法、常见问题、开始分析）；
 *   - four-images.home.card：首页卡片（agent-card）；
 *   - four-images.home.action：首页主操作（agent-action）。
 *
 * 工作台未安装/未启用时：导航服务与插槽都不存在，注册回调不执行，插件不报错，
 * preset 自身的会话行为完全不变。
 *
 * 模块 id 必须等于包名；React 来自浏览器模块表，不 require 任何 Harness Client 包。
 */
window.__ModuleLoader__.load({
  id: 'dsh-preset-four-images-model',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const PACKAGE_NAME = 'dsh-preset-four-images-model';
    const PRESET_ID = 'four-images-model';
    const NAV_ID = 'agent';
    const LOCALE_NS = 'fourImagesAgent';

    /* ------------------------------------------------------------------ */
    /* 文案                                                                */
    /* ------------------------------------------------------------------ */
    const DICT = {
      zh: {
        pageTitle: '四象分析',
        pageIntro: '六维、四阶段，把复杂管理问题拆开诊断，再汇总成一份带优先级的行动清单。页面只负责说明与入口，分析由「四象模型·DSH智能体」预设完成。',
        statusChecking: '正在检查预设…',
        statusReady: '预设已就绪',
        statusMissing: '未检测到预设',
        statusMissingHint: '未检测到 four-images-model 预设：请确认「四象模型·DSH智能体」已安装并启用，然后新建会话或重启 DSH。',
        statusBroken: '预设未激活',
        statusBrokenHint: '预设存在但未能激活：请检查插件版本与 DSH 版本，然后重启 DSH；也可在「设置 → 插件」查看诊断。',
        statusUnknown: '无法读取预设状态',
        startAnalysis: '开始四象分析',
        openPage: '打开页面',
        startedHint: '已请求新建会话；若没有自动打开，请检查工作区设置或手动新建会话。',
        startFailed: '无法新建会话：',
        cardTitle: '四象模型 · 分析智能体',
        cardText: '六维四阶段，逐维独立诊断、独立出方案，最后汇总成带优先级的行动清单。',
        sectionDimensions: '六维速览与推导顺序',
        dimensionsHint: '推导顺序固定：主体 → 环境 → 地位 → 行为 → 才能 → 心态。主体与环境只做确认与约束，不出方案；才能与心态始终是两个独立维度，从诊断到方案再到汇总都不合并。',
        colDimension: '维度',
        colFocus: '关注什么',
        colRole: '在本模型中的位置',
        dimSubject: '主体',
        dimSubjectFocus: '谁是第一主体、利益相关者、人物画像与组织画像',
        dimSubjectRole: '第一维；只确认与画像，不出方案',
        dimEnvironment: '环境',
        dimEnvironmentFocus: '环境因子、硬约束、时效性事实与外部趋势',
        dimEnvironmentRole: '第二维；只输出约束与待验证项，不出方案',
        dimPosition: '地位',
        dimPositionFocus: '权责边界、资源与话语权、角色定位',
        dimPositionRole: '诊断 + 方案（独立成节）',
        dimBehavior: '行为',
        dimBehaviorFocus: '流程、协作、执行与反馈',
        dimBehaviorRole: '诊断 + 方案（独立成节）',
        dimCapability: '才能',
        dimCapabilityFocus: '能力、机制、资源条件',
        dimCapabilityRole: '诊断 + 方案（独立成节，不与心态合并）',
        dimMindset: '心态',
        dimMindsetFocus: '意愿、认知、动力与阻力',
        dimMindsetRole: '诊断 + 方案（独立成节，不与才能合并）',
        sectionStages: '一次分析会发生什么',
        stagesHint: '父智能体自动推进四个阶段；阶段一可能会先向你澄清关键事实，你可以随时补充信息。',
        colStage: '阶段',
        colWho: '谁来做',
        colOutput: '产出',
        stage1: '阶段一 · 主体与环境确认',
        stage1Who: '父智能体（必要时向你提问）',
        stage1Out: '主体画像、利益相关者；环境因子与硬约束',
        stage2: '阶段二 · 位 / 行 / 才 / 心 并行诊断',
        stage2Who: '4 个诊断子代理',
        stage2Out: '各自返回结构化诊断 JSON（证据、置信度、数据缺口）',
        stage3: '阶段三 · 四维方案',
        stage3Who: '4 个方案子代理',
        stage3Out: '每维一份可执行方案，把数据缺口转成一次性验证动作',
        stage4: '阶段四 · 汇总报告',
        stage4Who: '父智能体',
        stage4Out: '六维总览 + 逐维独立成节 + 优先级行动清单 + 待验证项',
        sectionAsk: '怎么提问',
        askHint: '问题里带上主体、环境、现有流程和已知的数据缺口，分析会更具体。',
        askBadTitle: '不太好的问法',
        askBadExample: '“帮我分析一下公司管理问题。”',
        askBadWhy: '没有主体、没有环境、没有目标，六维只能泛泛而谈。',
        askGoodTitle: '更好的问法',
        askGoodExample: '“我们是一家 120 人的软件公司，新品导入周期比行业慢一倍；研发、产品、交付三方对责任边界说法不一。想两个季度内改善，但不能增加编制。”',
        askGoodWhy: '有主体与规模、有对比基准、有冲突点、有约束和时间窗口。',
        askExamplesTitle: '三个可直接改写的例子',
        askExample1: '某事业部新品导入周期比行业慢一倍，责任说不清，预算不能加，三个月内要见效。',
        askExample2: '30 人团队今年离职率 25%，核心骨干留不住；公司只能小幅调薪。',
        askExample3: '公司要从项目制转向产品制，中层不理解、执行走样；一年内完成，不裁员。',
        sectionRead: '怎么读报告',
        readHint: '报告按固定结构输出，建议按下面顺序读。',
        read1: '先看六维总览表：快速定位每一维的判断与优先级。',
        read2: '再读逐维详情：每维独立成节，附证据与置信度。',
        read3: '照优先级行动清单执行：先做高优先级、可验证的动作。',
        read4: '把待验证项当作下一步核实清单：没有证据的结论不会被写成事实。',
        sectionFaq: '常见问题',
        faq1Q: '预设选择器里没有「四象模型·DSH智能体」？',
        faq1A: '已有会话不会获得新预设，请新建会话；若仍没有，重启 DSH 并确认插件已安装、已启用。',
        faq2Q: '环境维度不联网 / 搜不到信息？',
        faq2A: '环境维度的时效事实依赖部署的 Web 搜索能力；没有搜索服务时，请直接提供环境信息，代理会把缺失部分标为待验证。',
        faq3Q: '提示模型 id 不存在？',
        faq3A: '本预设默认使用 deepseek-v4-flash / deepseek-v4-pro。若你的部署使用不同模型 id，请在 profile 的 cordis.patch.yml 覆盖两个 subagent 行的 agentOptions.model（详见 INSTALL.md）。',
        faq4Q: '报告会不会把「才能」和「心态」合并？',
        faq4A: '不会。两者从诊断到方案再到汇总都独立成节；若输出合并，可要求按六维拆分重写。',
      },
      en: {
        pageTitle: 'Four-Images Analysis',
        pageIntro: 'Six dimensions and four stages: diagnose a complex management problem dimension by dimension, then consolidate the result into a prioritized action list. This page only explains and launches; the Agent preset does the analysis.',
        statusChecking: 'Checking preset…',
        statusReady: 'Preset ready',
        statusMissing: 'Preset not found',
        statusMissingHint: 'The four-images-model preset was not found. Confirm that the analysis agent bundle is installed and enabled, then start a new session or restart DSH.',
        statusBroken: 'Preset not active',
        statusBrokenHint: 'The preset exists but failed to activate. Check the plugin and DSH versions, then restart DSH; diagnostics are available in Settings → Plugins.',
        statusUnknown: 'Preset status unavailable',
        startAnalysis: 'Start analysis',
        openPage: 'Open page',
        startedHint: 'A new session was requested. If it does not open, check the workspace setting or start a new session manually.',
        startFailed: 'Could not create a session: ',
        cardTitle: 'Four-Images Analysis Agent',
        cardText: 'Six dimensions in four stages: independent diagnosis and planning per dimension, consolidated into a prioritized action list.',
        sectionDimensions: 'Six dimensions and derivation order',
        dimensionsHint: 'The order is fixed: subject → environment → position → behavior → capability → mindset. Subject and environment only confirm constraints and produce no plan; capability and mindset always remain two independent dimensions, independent from diagnosis through the final report.',
        colDimension: 'Dimension',
        colFocus: 'Focus',
        colRole: 'Role in the model',
        dimSubject: 'Subject',
        dimSubjectFocus: 'Who the first subject is, stakeholders, person and organization profiles',
        dimSubjectRole: 'First dimension; confirms and profiles only, no plan',
        dimEnvironment: 'Environment',
        dimEnvironmentFocus: 'Environmental factors, hard constraints, time-sensitive facts, external trends',
        dimEnvironmentRole: 'Second dimension; constraints and open items only, no plan',
        dimPosition: 'Position',
        dimPositionFocus: 'Responsibility boundaries, resources and influence, role definition',
        dimPositionRole: 'Diagnosis + plan (its own section)',
        dimBehavior: 'Behavior',
        dimBehaviorFocus: 'Process, collaboration, execution, feedback',
        dimBehaviorRole: 'Diagnosis + plan (its own section)',
        dimCapability: 'Capability',
        dimCapabilityFocus: 'Abilities, mechanisms, resource conditions',
        dimCapabilityRole: 'Diagnosis + plan (its own section, never merged with mindset)',
        dimMindset: 'Mindset',
        dimMindsetFocus: 'Willingness, perception, drivers and resistance',
        dimMindsetRole: 'Diagnosis + plan (its own section, never merged with capability)',
        sectionStages: 'What happens in one analysis',
        stagesHint: 'The parent agent drives four stages automatically. Stage one may ask you clarifying questions first; you can add information at any time.',
        colStage: 'Stage',
        colWho: 'Who',
        colOutput: 'Output',
        stage1: 'Stage 1 · Subject and environment',
        stage1Who: 'Parent agent (asks questions when needed)',
        stage1Out: 'Subject profile and stakeholders; environmental factors and hard constraints',
        stage2: 'Stage 2 · Position / behavior / capability / mindset diagnosis in parallel',
        stage2Who: '4 diagnosis subagents',
        stage2Out: 'Structured JSON per dimension (evidence, confidence, data gaps)',
        stage3: 'Stage 3 · Plans for the four dimensions',
        stage3Who: '4 planning subagents',
        stage3Out: 'One executable plan per dimension, turning data gaps into one-off verification actions',
        stage4: 'Stage 4 · Consolidated report',
        stage4Who: 'Parent agent',
        stage4Out: 'Six-dimension overview + per-dimension sections + prioritized actions + open items',
        sectionAsk: 'How to ask',
        askHint: 'Include the subject, environment, current process, and known data gaps; the analysis becomes much more concrete.',
        askBadTitle: 'A weaker question',
        askBadExample: '"Analyze our management problems."',
        askBadWhy: 'No subject, no environment, no goal: each dimension can only stay generic.',
        askGoodTitle: 'A better question',
        askGoodExample: '"We are a 120-person software company. Our new-product introduction cycle is twice as slow as the industry. R&D, product, and delivery disagree on responsibility boundaries. We want to improve within two quarters without adding headcount."',
        askGoodWhy: 'It names the subject and scale, a benchmark, the conflict, constraints, and a time window.',
        askExamplesTitle: 'Three examples you can adapt',
        askExample1: 'A business unit introduces new products twice as slowly as the industry; responsibility is unclear, the budget cannot grow, and results are needed within three months.',
        askExample2: 'A 30-person team has a 25% attrition rate this year and cannot retain key people; the company can only give a small raise.',
        askExample3: 'The company is moving from project-based to product-based operation; middle managers do not understand it and execution drifts. It must finish within a year without layoffs.',
        sectionRead: 'How to read the report',
        readHint: 'The report follows a fixed structure. Read it in this order.',
        read1: 'Start with the six-dimension overview table to see each judgment and priority.',
        read2: 'Read the per-dimension sections, each with evidence and confidence.',
        read3: 'Follow the prioritized action list: do high-priority, verifiable actions first.',
        read4: 'Treat open items as the next verification checklist; conclusions without evidence are not presented as facts.',
        sectionFaq: 'Frequently asked questions',
        faq1Q: 'The preset is missing from the preset picker',
        faq1A: 'Existing sessions do not gain new presets; start a new session. If it is still missing, restart DSH and confirm the plugin is installed and enabled.',
        faq2Q: 'The environment dimension cannot search online',
        faq2A: 'Time-sensitive environmental facts depend on the deployment Web search capability. Without it, provide the facts yourself; missing parts are marked as open items.',
        faq3Q: 'The model id does not exist',
        faq3A: 'The preset defaults to deepseek-v4-flash and deepseek-v4-pro. If your deployment uses other model ids, override agentOptions.model on the two subagent rows in the profile cordis.patch.yml (see INSTALL.md).',
        faq4Q: 'Will the report merge capability and mindset?',
        faq4A: 'No. Both stay independent from diagnosis through planning to the consolidated report. If they are merged, ask the agent to rewrite them as six dimensions.',
      },
    };

    const DIMENSION_ROWS = [
      { key: 'subject', name: 'dimSubject', focus: 'dimSubjectFocus', role: 'dimSubjectRole' },
      { key: 'environment', name: 'dimEnvironment', focus: 'dimEnvironmentFocus', role: 'dimEnvironmentRole' },
      { key: 'position', name: 'dimPosition', focus: 'dimPositionFocus', role: 'dimPositionRole' },
      { key: 'behavior', name: 'dimBehavior', focus: 'dimBehaviorFocus', role: 'dimBehaviorRole' },
      { key: 'capability', name: 'dimCapability', focus: 'dimCapabilityFocus', role: 'dimCapabilityRole' },
      { key: 'mindset', name: 'dimMindset', focus: 'dimMindsetFocus', role: 'dimMindsetRole' },
    ];

    const STAGE_ROWS = [
      { key: 'stage1', name: 'stage1', who: 'stage1Who', out: 'stage1Out' },
      { key: 'stage2', name: 'stage2', who: 'stage2Who', out: 'stage2Out' },
      { key: 'stage3', name: 'stage3', who: 'stage3Who', out: 'stage3Out' },
      { key: 'stage4', name: 'stage4', who: 'stage4Who', out: 'stage4Out' },
    ];

    const ASK_EXAMPLES = ['askExample1', 'askExample2', 'askExample3'];
    const READ_KEYS = ['read1', 'read2', 'read3', 'read4'];
    const FAQ_ROWS = [
      { q: 'faq1Q', a: 'faq1A' },
      { q: 'faq2Q', a: 'faq2A' },
      { q: 'faq3Q', a: 'faq3A' },
      { q: 'faq4Q', a: 'faq4A' },
    ];

    /* ------------------------------------------------------------------ */
    /* 小工具                                                              */
    /* ------------------------------------------------------------------ */
    function translator(props) {
      return function t(key) {
        try {
          if (props && typeof props.t === 'function') {
            const value = props.t(key);
            if (value && value !== key) return value;
          }
        } catch (ignored) { /* fall through to the built-in dictionary */ }
        return (DICT.zh && DICT.zh[key]) || key;
      };
    }

    function safeCall(fn) {
      try {
        if (typeof fn === 'function') fn();
      } catch (ignored) { /* the host reports the failure through its own notice */ }
    }

    /* ------------------------------------------------------------------ */
    /* 组件                                                                */
    /* ------------------------------------------------------------------ */
    function StatusBadge(props) {
      const t = translator(props);
      let className = 'fi-badge fi-badge-muted';
      let key = 'statusChecking';
      if (props.status === 'ready') { className = 'fi-badge fi-badge-ok'; key = 'statusReady'; }
      else if (props.status === 'missing') { className = 'fi-badge fi-badge-warn'; key = 'statusMissing'; }
      else if (props.status === 'broken') { className = 'fi-badge fi-badge-warn'; key = 'statusBroken'; }
      else if (props.status === 'unknown') { key = 'statusUnknown'; }
      return h('span', { className: className }, t(key));
    }

    function AnalysisPage(props) {
      const t = translator(props);
      const [preset, setPreset] = React.useState({ status: 'checking' });
      const [notice, setNotice] = React.useState(null);

      React.useEffect(function check() {
        let mounted = true;
        const run = async function () {
          let result;
          try {
            result = props.checkPreset ? await props.checkPreset() : { status: 'unknown' };
          } catch (ignored) {
            result = { status: 'unknown' };
          }
          if (mounted) setPreset(result && result.status ? result : { status: 'unknown' });
        };
        run();
        return function cleanup() { mounted = false; };
      }, []);

      const blocked = preset.status === 'missing' || preset.status === 'broken';

      const onStart = function () {
        let result;
        try {
          result = props.startAnalysis ? props.startAnalysis() : { ok: false, reason: '' };
        } catch (error) {
          result = { ok: false, reason: error && error.message ? error.message : '' };
        }
        if (!result || !result.ok) {
          setNotice({ kind: 'error', text: t('startFailed') + ((result && result.reason) || '') });
          return;
        }
        setNotice({ kind: 'ok', text: t('startedHint') });
      };

      const section = function (title, children) {
        return h('section', { className: 'fi-section' },
          h('h2', { className: 'fi-section-title' }, t(title)),
          children);
      };

      const dimensionTable = h('table', { className: 'fi-table' },
        h('thead', null, h('tr', null,
          h('th', null, t('colDimension')),
          h('th', null, t('colFocus')),
          h('th', null, t('colRole')))),
        h('tbody', null, DIMENSION_ROWS.map(function (row) {
          return h('tr', { key: row.key },
            h('td', null, t(row.name)),
            h('td', null, t(row.focus)),
            h('td', null, t(row.role)));
        })));

      const stageTable = h('table', { className: 'fi-table' },
        h('thead', null, h('tr', null,
          h('th', null, t('colStage')),
          h('th', null, t('colWho')),
          h('th', null, t('colOutput')))),
        h('tbody', null, STAGE_ROWS.map(function (row) {
          return h('tr', { key: row.key },
            h('td', null, t(row.name)),
            h('td', null, t(row.who)),
            h('td', null, t(row.out)));
        })));

      const askSection = section('sectionAsk',
        h('p', { className: 'fi-section-hint' }, t('askHint')),
        h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '12px' } },
          h('div', { className: 'fi-card', style: { flex: '1 1 260px' } },
            h('h3', { className: 'fi-card-title' }, t('askBadTitle')),
            h('p', { className: 'fi-card-text' }, t('askBadExample')),
            h('p', { className: 'fi-card-text' }, t('askBadWhy'))),
          h('div', { className: 'fi-card', style: { flex: '1 1 320px' } },
            h('h3', { className: 'fi-card-title' }, t('askGoodTitle')),
            h('p', { className: 'fi-card-text' }, t('askGoodExample')),
            h('p', { className: 'fi-card-text' }, t('askGoodWhy')))),
        h('h3', { className: 'fi-card-title', style: { marginTop: '14px' } }, t('askExamplesTitle')),
        h('ol', { style: { margin: '0', paddingLeft: '20px', lineHeight: '1.9', fontSize: '13px' } },
          ASK_EXAMPLES.map(function (key) { return h('li', { key: key }, t(key)); })));

      const readSection = section('sectionRead',
        h('p', { className: 'fi-section-hint' }, t('readHint')),
        h('ul', { style: { margin: '0', paddingLeft: '20px', lineHeight: '1.9', fontSize: '13px' } },
          READ_KEYS.map(function (key) { return h('li', { key: key }, t(key)); })));

      const faqSection = section('sectionFaq',
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
          FAQ_ROWS.map(function (row) {
            return h('div', { className: 'fi-card', key: row.q },
              h('h3', { className: 'fi-card-title' }, t(row.q)),
              h('p', { className: 'fi-card-text', style: { margin: 0 } }, t(row.a)));
          })));

      return h('div', { className: 'fi-page' },
        h('section', { className: 'fi-hero' },
          h('div', null,
            h('h1', { className: 'fi-hero-title' }, t('pageTitle')),
            h('p', { className: 'fi-hero-text' }, t('pageIntro')))),
        h('div', { className: 'fi-actions', style: { marginBottom: '14px' } },
          h('button', {
            className: 'fi-btn fi-btn-primary',
            disabled: blocked,
            onClick: onStart,
          }, t('startAnalysis')),
          h(StatusBadge, { status: preset.status, t: t })),
        notice ? h('div', { className: 'fi-notice ' + (notice.kind === 'error' ? 'fi-notice-error' : 'fi-notice-ok') }, notice.text) : null,
        blocked ? h('div', { className: 'fi-notice fi-notice-info' }, preset.status === 'missing' ? t('statusMissingHint') : t('statusBrokenHint')) : null,
        section('sectionDimensions',
          h('p', { className: 'fi-section-hint' }, t('dimensionsHint')),
          dimensionTable),
        section('sectionStages',
          h('p', { className: 'fi-section-hint' }, t('stagesHint')),
          stageTable),
        askSection,
        readSection,
        faqSection);
    }

    function AgentHomeCard(props) {
      const t = translator(props);
      return h('div', { className: 'fi-card' },
        h('h3', { className: 'fi-card-title' }, t('cardTitle')),
        h('p', { className: 'fi-card-text' }, t('cardText')),
        h('div', { className: 'fi-actions' },
          h('button', {
            className: 'fi-btn',
            onClick: function () { safeCall(props.openPage); },
          }, t('openPage')),
          h('button', {
            className: 'fi-btn fi-btn-primary',
            onClick: function () { safeCall(props.startAnalysis); },
          }, t('startAnalysis'))));
    }

    function AgentHomeAction(props) {
      const t = translator(props);
      return h('button', {
        className: 'fi-btn fi-btn-primary',
        onClick: function () { safeCall(props.startAnalysis); },
      }, t('startAnalysis'));
    }

    /* ------------------------------------------------------------------ */
    /* Client 插件                                                         */
    /* ------------------------------------------------------------------ */
    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        try {
          ctx.effect(function () { return ctx.locale.register(LOCALE_NS, DICT); }, 'four-images-agent: dictionaries');
        } catch (ignored) { /* 没有 locale 服务时退回内置 zh 文案 */ }

        const checkPreset = async function () {
          try {
            const remote = ctx.remote;
            const namespace = remote && remote.agentPresets;
            if (!namespace || typeof namespace.list !== 'function') return { status: 'unknown' };
            const roster = await namespace.list();
            const presets = roster && Array.isArray(roster.presets) ? roster.presets : (Array.isArray(roster) ? roster : []);
            let found = null;
            for (const entry of presets) {
              if (entry && entry.id === PRESET_ID) { found = entry; break; }
            }
            if (!found) return { status: 'missing' };
            if (found.broken) return { status: 'broken', reason: String(found.broken) };
            return { status: 'ready', name: found.name || '' };
          } catch (ignored) {
            return { status: 'unknown' };
          }
        };

        const startAnalysis = function () {
          try {
            const workspace = ctx.get('uiWorkspace');
            if (!workspace || typeof workspace.startSession !== 'function') {
              return { ok: false, reason: 'uiWorkspace is unavailable' };
            }
            workspace.startSession(undefined, { agentPreset: PRESET_ID });
            return { ok: true };
          } catch (error) {
            return { ok: false, reason: error && error.message ? error.message : String(error) };
          }
        };

        const openPage = function () {
          try {
            const navigation = ctx.get('fourImagesNavigation');
            if (navigation && typeof navigation.select === 'function') navigation.select(NAV_ID);
          } catch (ignored) { /* navigation is optional */ }
        };

        const navigationEntry = {
          id: NAV_ID,
          label: { zh: '四象分析', en: 'Analysis' },
          order: 10,
        };

        /*
         * 可选导航：工作台未安装/未启用时服务不存在，回调不执行，不报错。
         * 若当前 Client 上下文没有 ctx.inject（旧版运行时的兜底），直接
         * 读取已提供的服务；两者都没有时静默跳过。
         */
        if (typeof ctx.inject === 'function') {
          try {
            ctx.inject(['fourImagesNavigation'], function (scope) {
              const navigation = (scope && scope.fourImagesNavigation) || ctx.get('fourImagesNavigation');
              if (!navigation || typeof navigation.add !== 'function') return;
              ctx.effect(function () { return navigation.add(navigationEntry); }, 'four-images-agent: navigation');
            });
          } catch (ignored) {
            const navigation = ctx.get('fourImagesNavigation');
            if (navigation && typeof navigation.add === 'function') {
              ctx.effect(function () { return navigation.add(navigationEntry); }, 'four-images-agent: navigation');
            }
          }
        } else {
          const navigation = ctx.get('fourImagesNavigation');
          if (navigation && typeof navigation.add === 'function') {
            ctx.effect(function () { return navigation.add(navigationEntry); }, 'four-images-agent: navigation');
          }
        }

        /* 整页：key 与导航 id 一致 */
        ctx.slots.inject('four-images.page', function () {
          return ctx.slots.register({
            name: 'four-images.page',
            key: NAV_ID,
            locale: LOCALE_NS,
            inject: function () {
              return { checkPreset: checkPreset, startAnalysis: startAnalysis, openPage: openPage };
            },
          }, AnalysisPage);
        });

        /* 首页卡片：入口 + 开始分析 */
        ctx.slots.inject('four-images.home.card', function () {
          return ctx.slots.register({
            name: 'four-images.home.card',
            id: 'agent-card',
            order: 10,
            locale: LOCALE_NS,
            inject: function () {
              return { openPage: openPage, startAnalysis: startAnalysis };
            },
          }, AgentHomeCard);
        });

        /* 首页主操作：开始分析 */
        ctx.slots.inject('four-images.home.action', function () {
          return ctx.slots.register({
            name: 'four-images.home.action',
            id: 'agent-action',
            order: 10,
            locale: LOCALE_NS,
            inject: function () {
              return { startAnalysis: startAnalysis };
            },
          }, AgentHomeAction);
        });
      },
    };
  },
});
