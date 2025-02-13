
const currentUrl = window.location.href;
const siteUrl = "https://neoneuron.github.io"; 
let updatedUrl = currentUrl.replace("https://neoneuron.github.io", "");
if (currentUrl.length == updatedUrl.length && currentUrl.startsWith("http://127.0.0.1")) {
  const otherSiteUrl = siteUrl.replace("localhost", "127.0.0.1");
  updatedUrl = currentUrl.replace(otherSiteUrl + "", "");
}
if ("".length > 0) {
  updatedUrl = updatedUrl.replace("/", "");
}
// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation menu",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-résumé",
          title: "résumé",
          description: "",
          section: "Navigation menu",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "Collection of my publications",
          section: "Navigation menu",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-teaching",
          title: "teaching",
          description: "Materials for courses teaching.",
          section: "Navigation menu",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "nav-blog",
          title: "blog",
          description: "collecting pieces of sparkling ideas",
          section: "Navigation menu",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-repositories",
          title: "repositories",
          description: "Please feel free to use them and raise issues if any questions.",
          section: "Navigation menu",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "post-compiling-boost-using-gcc-on-macos",
      
        title: 'Compiling boost using gcc on macOS <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.open("https://neoneuron.notion.site/Compiling-boost-using-gcc-on-macOS-53f9e1af73844c9da18c405cabff4b5c", "_blank");
        
      },
    },{id: "post-guide-to-install-deepdendrite",
      
        title: 'Guide to install DeepDendrite <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.open("https://neoneuron.notion.site/Install-DeepDendrite-b72dbcda941a439fb8b5bf0af1086e86?pvs=4", "_blank");
        
      },
    },{id: "post-fokker-planck-equation-for-lif-neuronal-networks",
      
        title: "Fokker Planck Equation for LIF Neuronal Networks",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2023/FPE-and-NMM/";
        
      },
    },{id: "post-nestml-installation",
      
        title: "NESTML Installation",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2021/install-nestml/";
        
      },
    },{id: "post-set-router-bridge-mode",
      
        title: "Set Router Bridge Mode",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2021/router-bridge/";
        
      },
    },{id: "news-my-phd-qualification-is-passed-smile",
          title: 'My PhD qualification is passed. :smile:',
          description: "",
          section: "News",},{id: "news-new-poster-and-oral-presentation-on-cccn2021-sparkles-smile",
          title: 'New poster and oral presentation on CCCN2021 :sparkles: :smile:',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/2021-06-CCCN_poster/";
            },},{id: "news-my-phd-thesis-proposal-is-passed",
          title: 'My PhD thesis proposal is passed.',
          description: "",
          section: "News",},{id: "news-new-poster-on-cccn2022-sparkles-smile",
          title: 'New poster on CCCN2022 :sparkles: :smile:',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/2022-06-CCCN_poster/";
            },},{id: "news-new-talk-on-csiam-2022-in-chinese",
          title: 'New talk on CSIAM 2022 (in Chinese)',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/2022-11-CSIAM_oral/";
            },},{id: "news-new-talk-on-siam-conference-for-applied-dynamical-system-2023",
          title: 'New talk on SIAM Conference for Applied Dynamical System 2023',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/2023-05-SIAM_oral/";
            },},{id: "news-new-poster-on-cns2023-sparkles-smile",
          title: 'New poster on CNS2023 :sparkles: :smile:',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/2023-07-CNS_poster/";
            },},{id: "news-new-poster-on-iciam2023-sparkles-smile",
          title: 'New poster on ICIAM2023 :sparkles: :smile:',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/2023-08-ICIAM_poster/";
            },},{id: "news-new-paper-published-on-pnas-sparkles-smile",
          title: 'New paper published on PNAS :sparkles: :smile:',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/2024-03-PNAS_paper/";
            },},{id: "news-new-poster-on-annual-meeting-of-chinese-neuroscience-society-2024",
          title: 'New poster on Annual meeting of Chinese Neuroscience Society (2024)',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/2024-09-CNS_poster/";
            },},{id: "news-recent-work-about-multi-area-rnn-has-been-accepted-as-a-poster-at-cosyne-2025-tada",
          title: 'Recent work about multi-area RNN has been accepted as a poster at COSYNE...',
          description: "",
          section: "News",},{id: "news-new-poster-on-the-fourth-symposium-on-neural-computation-and-beyond",
          title: 'New poster on the fourth Symposium on Neural Computation and Beyond',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/2025-01-SYNCB_poster/";
            },},{
        id: 'social-email',
        title: 'Send an email',
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
          id: 'lang-zh-cn',
          title: 'zh-cn',
          section: 'Languages',
          handler: () => {
            window.location.href = "/zh-cn" + updatedUrl;
          },
        },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];