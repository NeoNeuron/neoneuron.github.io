---
layout: post
title: NESTML安装教程
date: 2021-11-24
categories: code
tags: NEST-simulator
giscus_comments: true
---

## `NEST`与`NESTML`安装与使用指南

### 安装最新版本的`cmake` (需要`sudo`权限)

*参考资料: [https://graspingtech.com/upgrade-cmake/](https://graspingtech.com/upgrade-cmake/)*

```bash
sudo apt install build-essential libssl-dev
wget https://github.com/Kitware/CMake/releases/download/v3.22.0/cmake-3.22.0.tar.gz
tar -zxvf cmake-3.22.0.tar.gz
cd cmake-3.22.0
./bootstrap
make 
sudo make install 
```

### 安装`NEST`-`v3.1`

*参考资料: [https://nest-simulator.readthedocs.io/en/stable/installation/linux_install.html](https://nest-simulator.readthedocs.io/en/stable/installation/linux_install.html)*

**警告**: 通过`pip`或`conda`直接安装NEST v2.20.1 可能会产生该[报错问题](https://github.com/nest/nestml/issues/670)。

- 新建conda环境.
    ```bash
    conda create -n nestml python=3.9 -y
    ```

- 安装依赖环境.
    ```bash
    conda activate nestml
    conda install -y numpy cython matplotlib ipython scipy
    conda install -y pytest pytest-xdist pytest-timeout
    pip install junitparser
    ```

- 下载[最新版的NEST安装包](https://github.com/nest/nest-simulator/releases/tag/v3.1)
    ```bash
    wget -O nest-simulator-3.1.tar.gz https://codeload.github.com/nest/nest-simulator/tar.gz/refs/tags/v3.1
    ```

- 解压tar压缩包
    ```bash
    tar -xzvf nest-simulator-3.1.tar.gz
    ```

- 创建编译目录

    ```bash
    mkdir nest-simulator-3.1-build
    ```

- 切换到编译目录

    ```bash
    cd nest-simulator-3.1-build
    ```

- 配置NEST。可能需要额外cmake配置选项(see [CMake Options for NEST](https://nest-simulator.readthedocs.io/en/stable/installation/cmake_options.html)).

    ```bash
    cmake ../nest-simulator-3.1/
    ```

- 编译NEST并安装:

    ```bash
    make
    make install
    make installcheck
    ```

    `make installcheck`命令会检查安装是否成功。如果安装成功，会显示如下信息:

    ```bash
    [100%] Built target installcheck
    ```

### 安装最新的`NEST::ml`开发版本

*参考资料: [https://nestml.readthedocs.io/en/latest/installation.html](https://nest-simulator.readthedocs.io/en/stable/installation/linux_install.html)*

从GitHub下载最新的开发版本。

```bash
git clone https://github.com/nest/nestml
```

安装到当前Python环境。

```bash
cd nestml
python setup.py install --user
```

**注意:** `antlr4-python3-runtime==4.10`可能引起报错，推荐版本：`4.9.3`。

#### 测试安装 (可选)

安装完成后，可通过下面命令检验是否安装成功。

```bash
python setup.py test
```

*注意：`tests.docstring_comment_test`可能会失败报错，但并不影响正常使用。*

### 安装测试`*.nestml`模块

*参考资料: [https://nestml.readthedocs.io/en/latest/tutorials/izhikevich/nestml_izhikevich_tutorial.html](https://nest-simulator.readthedocs.io/en/stable/installation/linux_install.html)*

```python
import nest
from pynestml.frontend.pynestml_frontend import to_nest, install_nest

NEST_SIMULATOR_INSTALL_LOCATION = nest.ll_api.sli_func("statusdict/prefix ::")

to_nest(input_path="izhikevich_solution.nestml", # replace with path of your own nestml file
        target_path="~/tmp/nestml-component",
        logging_level="ERROR")

install_nest("~/tmp/nestml-component", NEST_SIMULATOR_INSTALL_LOCATION)

nest.Install("nestmlmodule")
```

### 使用NEST编写模型并运行

```python
import numpy as np
import matplotlib.pyplt as plt
import nest

nest.set_verbosity("M_WARNING")
nest.ResetKernel()

neuron = nest.Create("izhikevich_tutorial") # replace with name of your own model
voltmeter = nest.Create("voltmeter")

voltmeter.set({"record_from": ["v", "u"]})
nest.Connect(voltmeter, neuron)

cgs = nest.Create('dc_generator')
cgs.set({"amplitude": 25.})
nest.Connect(cgs, neuron)

sr = nest.Create("spike_recorder")
nest.Connect(neuron, sr)

nest.Simulate(250.)

spike_times = nest.GetStatus(sr, keys='events')[0]['times']

fig, ax = plt.subplots(nrows=2)
ax[0].plot(voltmeter.get("events")["times"], voltmeter.get("events")["v"])
ax[1].plot(voltmeter.get("events")["times"], voltmeter.get("events")["u"])
ax[0].scatter(spike_times, 30 * np.ones_like(spike_times), marker="d", c="orange", alpha=.8, zorder=99)
for _ax in ax:
    _ax.grid(True)
ax[0].set_ylabel("v [mV]")
ax[1].set_ylabel("u")
ax[-1].set_xlabel("Time [ms]")
fig.savefig('test.png')
fig.show()
```

代码输出结果如下:
<div class="row">
    {% include figure.liquid path="/assets/figures/2021-11-24-test.png" class="img-fluid rounded z-depth-1" zoomable=true %}
</div>