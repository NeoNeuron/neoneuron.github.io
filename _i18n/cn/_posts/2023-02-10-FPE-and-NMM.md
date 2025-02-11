---
layout: distill 
title: 神经元网络Fokker Planck方程
date: 2023-02-10
categories: neuroscience
tags: Fokker-Planck
bibliography: 2023-02-10-fpe.bib
authors:
  - name: Kai Chen
---

<div class="l-page-outset">
给定$N$个兴奋性LIF神经元，将他们依照一个固定的概率$p$随机链接构成一个网络，其中每个神经元的细胞跨膜电压可以用如下方程描述：
$$
\begin{equation}
    \begin{aligned}
       \frac{dV_i}{dt} = -\frac{g_l}{C_m}(V_i-V_l) + \frac{I_\mathrm{ext}}{C_m} + \sum_j^N\sum_k w_{ij}\delta(t-t_j^k),
    \end{aligned}
    \label{eq:lif}
\end{equation}
$$
其中$g_l$，$C_m$，$V_l$分别为神经元的电导，电容和漏电电位，$I_\mathrm{ext}$为外部输入电流，$w_{ij}$为神经元$i$和$j$之间的作用强度，即神经元$j$接收到来自神经元$i$的一个脉冲输入后电压的将上升$w_{ij}$，而$t_j^k$为神经元$j$的第$k$次脉冲发放时间。下面我们假设，网络中所有的神经元都是接受相同的电流输入，且不同神经元之间的作用强度$w_{ij}= w$，均相同。由于所有神经元在网络中的地位都是相同的，与其通过$N$个相互耦合的常微分方程来刻画网络中所有神经元在任意$t$时刻的电压状态$V_i$，不如统计一下每个$t$时刻处于不同电压值的神经元的数量。若将LIF神经元的静息电位$V_\text{r}$到阈值电位$V_\theta$，平均分分成长度为$\Delta V$的等间隔小区间，统计$t$时刻电压值落在$[V-\Delta V/2,V+\Delta V/2)$区间内的神经元个数，$n(V,t)$，则落在该区间内的神经元数量的概率为：
$$
\begin{equation}
P(V,t) = \frac{n(V,t)}{N}.
\end{equation}
$$
根据最朴素的神经元数目守恒的原则，我们下面简单分析一下，在$t+\Delta t$时刻，$P(V,t+\Delta t)$将会是多少。神经元膜电位的变化由\ref{eq:lif}决定，因此区间$[V-\Delta V/2, V+\Delta V/2)$内神经元数目的增加由三个部分贡献。第一，从$[V-3\Delta V/2, V-\Delta V/2)$转移到$[V-\Delta V/2, V+\Delta V/2)$的神经元数量，由外加电流$I_\mathrm{ext}$的强度决定，可以由如下方程描述：
$$
\begin{equation}
P(V-\Delta V, t)\frac{I_\mathrm{ext}}{C_m}\Delta t.
\end{equation}
$$

第二，从$[V-\Delta V/2, V+\Delta V/2)$转移到$[V+\Delta V/2, V+3\Delta V/2)$的神经元数量，由神经元漏电流的强度与当前神经元的膜电位决定，可以由如下方程描述：

$$
\begin{equation}
P(V+\Delta V, t)\frac{g_l}{C_m}(V+\Delta V-V_l)\Delta t.
\end{equation}
$$

第三，其他神经元放电所产生的突触电流，公式\ref{eq:lif}中的等式右端第三项。由于网络中神经元的发放时间是随机的，不妨将其视为平均放电率相同的Poisson过程。由此，我们统计平均单位时间内每个神经元接收到的突触发放电流数目为$\nu(t)$，其中
$$
\nu(t) = \frac{1}{\Delta}\int\limits_{t-\Delta t/2}^{t+\Delta t/2}\sum_{k=1}^N\delta(\tau-t_k)d\tau.
$$

由于突触后膜电位在接收到输入后会瞬时增加$w$，因此，突触输入将使得$[V-\Delta V/2, V+\Delta V/2)$区间内神经元数目增加：
$$
\begin{equation}
\nu(t)\Delta t \cdot P(V-w, t)\cdot \Delta V.
\end{equation}
$$

类似的，从$[V-\Delta V/2, V+\Delta V/2]$流出的神经元数量，如下方程描述：

$$
\begin{equation}
    \begin{aligned}
        \left[V-\frac{\Delta V}{2}, V+\frac{\Delta V}{2}\right)\to\left[V-\frac{3\Delta V}{2}, V-\frac{\Delta V}{2}\right): &\quad P(V, t)\frac{g_l}{C_m}(V-V_l)\Delta t,\\
        \left[V-\frac{\Delta V}{2}, V+\frac{\Delta V}{2}\right)\to\left[V+\frac{\Delta V}{2}, V+\frac{3\Delta V}{2}\right): &\quad P(V, t)\frac{I_\mathrm{ext}}{C_m}\Delta t,\\
        \left[V-\frac{\Delta V}{2}, V+\frac{\Delta V}{2}\right)\to\left[V+w-\frac{\Delta V}{2}, V+w+\frac{\Delta V}{2}\right): &\quad \nu(t)\Delta t \cdot P(V, t)\Delta V.\\
    \end{aligned}
\end{equation}
$$

<div class="row">
    {% include figure.liquid path="/assets/figures/FPE.png" class="img-fluid rounded" zoomable=true %}
</div>
<p style="text-align:center">
<b>主方程</b>。主要描述位于膜电位区间$\left[V-\Delta V/2,V+\Delta V/2\right]$中神经元数目的概率密度在$t$时刻的变化情况。</p>

因此，我们可以得到如下方程描述的神经元数目的变化：
$$
\begin{equation}
\begin{aligned}
\left[P(V, t+\Delta t) - P(V, t)\right]\Delta V &= \text{流入区间的神经元数目}-\text{流出区间的神经元数目}\\
&=P(V-\Delta V, t)\frac{I_\mathrm{ext}}{C_m}\Delta t+ P(V+\Delta V, t)\frac{g_l}{C_m}(V+\Delta V-V_l)\Delta t + \nu(t)\Delta t \cdot P(V-w, t)\Delta V \\
&\quad- P(V, t)\frac{g_l}{C_m}(V-V_l)\Delta t - P(V, t)\frac{I_\mathrm{ext}}{C_m}\Delta t-\nu(t)\Delta t \cdot P(V, t)\Delta V\\
&=\left[P(V-\Delta V, t)-P(V,t)\right]\frac{I_\mathrm{ext}}{C_m}\Delta t+ \left[P(V+\Delta V, t)f(V+\Delta V)-P(V,t)f(V)\right]\Delta t \\
&\quad+ \nu(t)\Delta t \Delta V \cdot \left[P(V-w, t) - P(V, t)\right]
\end{aligned}
\end{equation}
$$

其中$f(V) =g_l(V-V_l)/C_m$。移项整理得到

$$
\begin{equation}
\begin{aligned}
\frac{\left[P(V, t+\Delta t) - P(V, t)\right]}{\Delta t} &=\frac{\left[P(V-\Delta V, t)-P(V,t)\right]}{\Delta V}\frac{I_\mathrm{ext}}{C_m}+ \frac{\left[P(V+\Delta V, t)f(V+\Delta V)-P(V,t)f(V)\right]}{\Delta V} \\
&\quad+ \nu(t) \cdot \left[P(V-w, t) - P(V, t)\right].
\end{aligned}
\label{equ:master}
\end{equation}
$$

至此，我们得到了对于电压$V$取值范围内有限离散划分与时间不长$\Delta t$下的主方程(Master equation)。而神经元膜电压是一个连续取值的变量，因此，我们可以讲方程\ref{equ:master}推广到连续形式，即当神经元数目充分大，且电压划分足够密时，$N\to\infty$，$\Delta V\to 0$，我们可以将方程\ref{equ:master}中的$P(V, t)$渐进收敛为膜电压的概率密度函数$p(V,t)$。同时，我们令时间不长$\Delta t\to 0$，则方程\ref{equ:master}中的离散差分变为微分，即可的：

$$
\begin{equation}
\frac{\partial p(V, t)}{\partial t} = \frac{\partial}{\partial V} \left[\left(f(V)-\frac{I_\mathrm{ext}}{C_m}\right)p(V, t)\right]+ \nu(t) \cdot \left[p(V-w, t) - p(V, t)\right].
\label{equ:master_dev}
\end{equation}
$$

方程\ref{equ:master_dev}描述了膜电压概率密度函数的微分方程。其中等式右端第一项为描述了神经元漏电流以及外界连续电流输入对于$V$的分布额影响，第二项描述了网络内神经元随机放电并相互作用所产生的对于膜电压的影响。另外，由于大脑皮层中神经元之间往往存在成百上千个突触连接，而单个突触单个脉冲放电引起的突触后膜电位改变(EPSP/IPSP)，模型中的$w$，相较于膜电位的取值范围，可以视为小量。因此，我们可以运用扩散近似，关于$w$为小量，泰勒展开方程\ref{equ:master_dev}中$P(V-w,t)$右端第二项至二阶，即

$$
\begin{equation}
p(V-w, t) = p(V, t) - \frac{\partial p(V, t)}{\partial V} w + \frac{1}{2} \frac{\partial^2 p(V, t)}{\partial V^2} w^2 + \mathcal{O}(w^3)
\end{equation}
$$

将上式带入方程\ref{equ:master_dev}并省略三阶小量$\mathcal{O}(w^3)$，得到

$$
\begin{equation}
\frac{\partial p(V, t)}{\partial t} = \frac{\partial}{\partial V} \left[\left(f(V)-\frac{I_\mathrm{ext}}{C_m}-\nu(t)w\right)p(V, t)\right]+ \frac{\nu(t)w^2}{2} \frac{\partial^2}{\partial V^2} p(V, t).
\label{equ:fpe}
\end{equation}
$$

方程\ref{equ:fpe}便是著名的Fokker-Planck方程(FPE)的一维形式。最早由Adriaan Fokker和Max Planck于1914和1917年提出，用于描述统计物理中，流体粒子在随机力和牵引力的作用下，粒子数概率密度函数在平衡状态附近演化的偏微分方程<d-cite key="fokker1914mittlere,risken1996fokkerplanck"></d-cite>。而在神经科学领域，FPE被用于描述神经元膜电位$V$的演化<d-cite key="deco2008dynamic,breakspear2017dynamic"></d-cite>。FPE方程右端第一项为描述了神经元漏电流，外界连续电流输入，以及网络内神经元相互作用的平均效应对于$V$的分布额影响，通常称之为对流项。第二项描述了网络内神经元随机放电的相互作用所产生的对于膜电压涨落的影响，称之为扩散项。

对于LIF神经元模型，即便在扩散近似的极限条件下，$p(V,t)$仍然存在不连续的情况，即当$V=V_\theta$时，神经元将产生动作电位并重置电压值为$V_\mathrm{r}$。因此，$p(V_\theta,t)$存在神经元数目减少，其速率为神经元的平均放电率，即$\left.\frac{\partial p}{\partial t}\right|_{V=V_\theta}=-\left.\frac{\partial \boldsymbol{J}}{\partial V}\right|_{V=V_\theta}+A(t)$，其中，$A(t)$为神经元的平均放电率。与此同时，由于膜电位重置的机制，将有等量的神经元在$V=V_\mathrm{r}$处补充。因此，我们需要方程\ref{equ:fpe}进行修正，添加LIF发放重置机制对于$p(V,t)$的影响：

$$
\begin{equation}
\begin{aligned}
\frac{\partial p(V, t)}{\partial t} &= \frac{\partial}{\partial V} \left[\left(f(V)-\frac{I_\mathrm{ext}}{C_m}-\nu(t)w\right)p(V, t)\right]+ \frac{\nu(t)w^2}{2} \frac{\partial^2}{\partial V^2} p(V, t)\\
&\quad + A(t) \delta\left(V-V_\mathrm{r}\right) - A(t)\delta\left(V-V_\theta\right).
\end{aligned}
\label{equ:fpe_lif}
\end{equation}
$$

根据LIF神经元的发放重置机制，易知LIF神经元的膜电位不会超过$V_\theta$，即当$V>V_\theta$时，$p(V,t)=0$。另外，根据扩散极限的限制，我们可以得知当$V=V_\theta$时，$p(V,t)=0$。因此，根据上述边界条件并结合适当的初值条件，我们可以通过解析或数值方法求解方程\ref{equ:fpe_lif}，得到膜电压概率密度函数$p(V,t)$，神经元平均放电率$A(t)$的解。

根据上文的讨论，我们发现FPE将神经网络包含$\mathcal{O}(N)$自由度的庞大高维动力系统简化成一个仅包含两个变量的一维偏微分方程系统。这种模型简化大大降低了模型的复杂度，让我们可以复杂的网络LIF网络动力学有了直观的理解。同时，我们注意到上述FPE的基于两个简单假设：一，网络内神经元全为兴奋性的基于电流的LIF神经元；二，神经元之间的连接权重相同，拓扑上随机连接，没有空间结构的差异。为了更好的符合皮层真实神经元网络的特点，我们需要对于更一般的FPE模型，例如引入基于电导的神经元模型<d-cite key="cai2006kinetica"></d-cite>，考虑小世界网络或无标度网络等更符合生物神经网络特点的网络连接结构等。
<!-- 然而，这一研究方向需要运用大量复杂的理论统计物理工具，同时引入更加复杂的PDE方程也会大大增加数值模拟的计算复杂度。因而在此我们将不过多讨论这方面的工作。 -->
</div>
