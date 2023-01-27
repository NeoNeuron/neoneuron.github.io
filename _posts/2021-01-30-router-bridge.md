---
layout: post
title: "Set Router Bridge Mode"
date: 2021-01-30
categories: tech
tags: router-setting
---

This is a note for router bridge mode setups.

## Setup main router

Follow the default instruction of router setups.

## Setup bridging router

1. Connect the WIFI of router, and open `192.168.1.1` from your browser.
2. Set the LAN IP address to `192.168.1.100`, and restart the router.
3. Open the configuration website with new IP `192.168.1.100`.
4. Turn off the DHCP server.
5. Set a proper range for address pool. Note that it should not cover the LAN IP address you set previously.
6. Go to wireless setting to open WDS. Scan the AP list and select the main router.
7. Enter the password to bridge to the main router.
8. Save all settings and restart the router. *Recommended:choose the same channel for bridge router as the main ones.*
9. Reconnect to the bridge router.

**ENJOY your day!**