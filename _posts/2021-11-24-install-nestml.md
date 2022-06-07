---
layout: post
title: NESTML Installation
date: 2021-11-24
categories: coding
tags: nest-simulator
---

## Get started with `NEST` and `NESTML`

### Install latest version of `cmake` (need `sudo` authorization)

*Reference: [https://graspingtech.com/upgrade-cmake/](https://graspingtech.com/upgrade-cmake/)*

```bash
sudo apt install build-essential libssl-dev
wget https://github.com/Kitware/CMake/releases/download/v3.22.0/cmake-3.22.0.tar.gz
tar -zxvf cmake-3.22.0.tar.gz
cd cmake-3.22.0
./bootstrap
make 
sudo make install 
```

### Install `NEST` `v3.1`

*Reference: [https://nest-simulator.readthedocs.io/en/stable/installation/linux_install.html](https://nest-simulator.readthedocs.io/en/stable/installation/linux_install.html)*

**WARNING**: Directly install NEST v2.20.1 from `pip` or `conda` might leads to [this issue](https://github.com/nest/nestml/issues/670).

- Create a new Python environment.
    ```bash
    conda create -n nestml python=3.9 -y
    ```

- Install necessary dependence.
    ```bash
    conda activate nestml
    conda install -y numpy cython matplotlib ipython scipy
    conda install -y pytest pytest-xdist pytest-timeout
    pip install junitparser
    ```

- Download [latest NEST package](https://github.com/nest/nest-simulator/releases/tag/v3.1)
    ```bash
    wget -O nest-simulator-3.1.tar.gz https://codeload.github.com/nest/nest-simulator/tar.gz/refs/tags/v3.1
    ```

- Unpack the tarball
    ```bash
    tar -xzvf nest-simulator-3.1.tar.gz
    ```

- Create a build directory
    ```bash
    mkdir nest-simulator-3.1-build
    ```

- Change to the build directory:
    ```bash
    cd nest-simulator-3.1-build
    ```

- Configure NEST. You may need additional cmake options (see [CMake Options for NEST](https://nest-simulator.readthedocs.io/en/stable/installation/cmake_options.html)).
    ```bash
    cmake ../nest-simulator-3.1/
    ```

- Compile and install NEST:
    ```bash
    make
    make install
    make installcheck
    ```

If there is no failure occurs in installcheck, then NEST should now be successfully installed in your active Python environment.

### Install the latest development version of `NEST::ml`

*Reference: [https://nestml.readthedocs.io/en/latest/installation.html](https://nest-simulator.readthedocs.io/en/stable/installation/linux_install.html)*

To obtain the latest development version, clone directly from the master branch of the GitHub repository:
```bash
git clone https://github.com/nest/nestml
```

Install into your current Python environment using:
```bash
cd nestml
python setup.py install --user
```

**Note:** `antlr4-python3-runtime==4.10` will lead to a **BUG**. `4.9.3` is recommended.

#### Testing (Optional)
After installation, correct operation can be tested by:
```bash
python setup.py test
```
*Note that, tests.docstring_comment_test might fail. If so, please ignore it which won't affect your usage.*

### Install example `*.nestml` file

*Reference: [https://nestml.readthedocs.io/en/latest/tutorials/izhikevich/nestml_izhikevich_tutorial.html](https://nest-simulator.readthedocs.io/en/stable/installation/linux_install.html)*

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

### Instantiate model in NEST Simulator and run

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

<div class="row">
    {% include figure.html path="/assets/figures/2021-11-24-test.png" class="img-fluid rounded z-depth-1" zoomable=false %}
</div>