---
layout: post
title: "美国工业与应用数学学会应用动力系统分会 2023 口头报告 :sparkles: :smile:"
date: 2023-05-18 12:00:00-0700
categories: Symposium
tags: causality, correlation, mutual-information, Granger-causality, transfer-entropy, neural-networks
---

{% include figure.liquid path='assets/img/2023-05-18-SIAM-DS23.png' class="img-fluid" %}

> SIAM-DS23 报告链接：[🔗](https://meetings.siam.org/sess/dsp_talk.cfm?p=132553)

**Abstract**:
人们常常通过推断网络的因果连接来理解网络的功能。已有的共识认为，推断得到的因果连接依赖于所采用的因果性度量，并且可能与网络底层的结构连接并不一致。然而，因果连接的解释仍有待厘清，特别是因果连接如何依赖于因果性度量，以及因果连接与结构连接之间是何种关系。在此，我们聚焦于以脉冲信号作为可测输出的非线性网络，例如以放电脉冲为输出的神经网络，并基于四种被广泛使用的因果性度量——时延相关、时延互信息、格兰杰因果与传递熵——来讨论上述问题。我们从理论上给出了这四种因果性度量应用于脉冲信号时彼此之间的关系。以仿真的Hodgkin-Huxley神经网络和真实的小鼠脑网络为两个示例，我们进一步验证了这四种因果性度量之间的定量关系，并证明由其中任意一种所推断出的因果连接都与网络底层的结构连接高度吻合，从而在因果连接与结构连接之间建立了直接联系。我们强调，网络的结构连接可以通过成对的方式重建，而无需以网络中所有其他节点的全局信息为条件，因此规避了“维度灾难”问题。我们的框架为脉冲输出网络的重建提供了一种切实可行且有效的方法。
