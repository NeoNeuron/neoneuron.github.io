---
layout: post
title: "New talk on CSIAM 2022 (in Chinese)"
date: 2022-11-20 15:00:00+0800
categories: Symposium
tags: causality, correlation, mutual-information, Granger-causality, transfer-entropy, neural-networks 
---

{% include figure.liquid path='assets/img/CSIAM2022.png' class="img-fluid" %}

[Link](https://meeting.csiam.org.cn/#/2022/) to CSIAM2022.

**Abstract**: The causal connectivity of a network is often inferred to understand the network function. It is arguably acknowledged that the inferred causal connectivity relies on causality measure one applies, and it may differ from the network's underlying structural connectivity. However, the interpretation of causal connectivity remains to be fully clarified, in particular, how causal connectivity depends on causality measures and how causal connectivity relates to structural connectivity. Here, we focus on nonlinear networks with pulse signals as measured output, e.g., neural networks with spike output, and address the above issues based on four intensively utilized causality measures, i.e., time-delayed correlation, time-delayed mutual information, Granger causality, and transfer entropy. We theoretically show how these causality measures are related to one another when applied to pulse signals. Taking the simulated Hodgkin-Huxley neural network and the real mouse brain network as two illustrative examples, we further verify the quantitative relations among the four causality measures and demonstrate that the causal connectivity inferred by any of the four well coincides with the underlying network structural connectivity, therefore establishing a direct link between the causal and structural connectivity. We stress that the structural connectivity of networks can be reconstructed pairwisely without conditioning on the global information of all other nodes in a network, thus circumventing the curse of dimensionality. Our framework provides a practical and effective approach for pulse-output network reconstruction.
