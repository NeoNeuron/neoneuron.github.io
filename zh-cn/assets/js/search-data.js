
const currentUrl = window.location.href;
const siteUrl = "https://neoneuron.github.io"; 
let updatedUrl = currentUrl.replace("https://neoneuron.github.io", "");
if (currentUrl.length == updatedUrl.length && currentUrl.startsWith("http://127.0.0.1")) {
  const otherSiteUrl = siteUrl.replace("localhost", "127.0.0.1");
  updatedUrl = currentUrl.replace(otherSiteUrl + "", "");
}
if ("zh-cn".length > 0) {
  updatedUrl = updatedUrl.replace("/zh-cn", "");
}
// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-简介",
    title: "简介",
    section: "导航栏",
    handler: () => {
      window.location.href = "/zh-cn/";
    },
  },{id: "nav-简历",
          title: "简历",
          description: "",
          section: "导航栏",
          handler: () => {
            window.location.href = "/zh-cn/cv/";
          },
        },{id: "nav-论文",
          title: "论文",
          description: "一些小论文",
          section: "导航栏",
          handler: () => {
            window.location.href = "/zh-cn/publications/";
          },
        },{id: "nav-教学",
          title: "教学",
          description: "一些教学资料。",
          section: "导航栏",
          handler: () => {
            window.location.href = "/zh-cn/teaching/";
          },
        },{id: "nav-博客",
          title: "博客",
          description: "一点点胡思乱想的痕迹",
          section: "导航栏",
          handler: () => {
            window.location.href = "/zh-cn/blog/";
          },
        },{id: "nav-代码",
          title: "代码",
          description: "欢迎使用，如有任何问题，请给我提issue。",
          section: "导航栏",
          handler: () => {
            window.location.href = "/zh-cn/repositories/";
          },
        },{id: "post-在macos上使用gcc编译boost",
      
        title: '在macOS上使用gcc编译boost <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.open("https://neoneuron.notion.site/Compiling-boost-using-gcc-on-macOS-53f9e1af73844c9da18c405cabff4b5c", "_blank");
        
      },
    },{id: "post-deepdendrite安装指南",
      
        title: 'DeepDendrite安装指南 <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.open("https://neoneuron.notion.site/Install-DeepDendrite-b72dbcda941a439fb8b5bf0af1086e86?pvs=4", "_blank");
        
      },
    },{id: "post-神经元网络fokker-planck方程",
      
        title: "神经元网络Fokker Planck方程",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/zh-cn/blog/2023/FPE-and-NMM/";
        
      },
    },{id: "post-nestml安装教程",
      
        title: "NESTML安装教程",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/zh-cn/blog/2021/install-nestml/";
        
      },
    },{id: "post-路由器桥接配置",
      
        title: "路由器桥接配置",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/zh-cn/blog/2021/router-bridge/";
        
      },
    },{id: "news-my-phd-qualification-is-passed-smile",
          title: 'My PhD qualification is passed. :smile:',
          description: "",
          section: "News",},{id: "news-新海报和口头汇报发表在-cccn2021-sparkles-smile",
          title: '新海报和口头汇报发表在 CCCN2021 :sparkles: :smile:',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/zh-cn/news/2021-06-CCCN_poster/";
            },},{id: "news-my-phd-thesis-proposal-is-passed",
          title: 'My PhD thesis proposal is passed.',
          description: "",
          section: "News",},{id: "news-新海报发表在-cccn2022-sparkles-smile",
          title: '新海报发表在 CCCN2022 :sparkles: :smile:',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/zh-cn/news/2022-06-CCCN_poster/";
            },},{id: "news-csiam-2022-学生论坛口头汇报-中文",
          title: 'CSIAM 2022 学生论坛口头汇报(中文)',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/zh-cn/news/2022-11-CSIAM_oral/";
            },},{id: "news-美国工业与应用数学学会应用动力系统分会-2023-口头报告-sparkles-smile",
          title: '美国工业与应用数学学会应用动力系统分会 2023 口头报告 :sparkles: :smile:',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/zh-cn/news/2023-05-SIAM_oral/";
            },},{id: "news-新海报入选-cns2023-sparkles-smile",
          title: '新海报入选 CNS2023 :sparkles: :smile:',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/zh-cn/news/2023-07-CNS_poster/";
            },},{id: "news-新海报入选-iciam2023-sparkles-smile",
          title: '新海报入选 ICIAM2023 :sparkles: :smile:',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/zh-cn/news/2023-08-ICIAM_poster/";
            },},{id: "news-关于-因果推断网络重构-新文章发表在美国科学院院刊-pnas-sparkles-smile",
          title: '关于“因果推断网络重构“新文章发表在美国科学院院刊（PNAS） :sparkles: :smile:',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/zh-cn/news/2024-03-PNAS_paper/";
            },},{id: "news-新海报入选2024中国神经科学年会",
          title: '新海报入选2024中国神经科学年会',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/zh-cn/news/2024-09-CNS_poster/";
            },},{id: "news-多脑区循环神经网络训练框架被cosyne2025接收-将作为墙报展示-tada",
          title: '多脑区循环神经网络训练框架被COSYNE2025接收，将作为墙报展示。:tada:',
          description: "",
          section: "News",},{id: "news-新海报入选第四届神经计算青年研讨会",
          title: '新海报入选第四届神经计算青年研讨会',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/zh-cn/news/2025-01-SYNCB_poster/";
            },},{
        id: 'social-email',
        title: '发邮件',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6B%63%68%65%6E%35%31%33@%6F%75%74%6C%6F%6F%6B.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/Neoneuron", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/kai-chen-a35666a6", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0009-0004-3834-9504", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=TzcYWrUAAAAJ", "_blank");
        },
      },{
        id: 'social-x',
        title: 'X',
        section: 'Socials',
        handler: () => {
          window.open("https://twitter.com/kchen513", "_blank");
        },
      },{
          id: 'lang-en-us',
          title: 'en-us',
          section: '语言',
          handler: () => {
            window.location.href = "" + updatedUrl;
          },
        },{
      id: 'light-theme',
      title: '切换日间模式',
      description: '切换日间模式',
      section: '主题',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: '切换夜间模式',
      description: '切换夜间模式',
      section: '主题',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: '切换系统主题模式',
      description: '切换系统主题模式',
      section: '主题',
      handler: () => {
        setThemeSetting("system");
      },
    },];