---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

<span class="greeting" data-default="Hello">Hello</span>, my name is <span class="hero-name">Yue Fang</span>. I am currently pursuing a Ph.D. in Computer Science at Peking University. My research interests lie in medical large language models (LLMs), reinforcement learning (RL), and retrieval-augmented generation (RAG).

<div class="interest-tags">
  <span class="interest-tag">Medical LLM</span>
  <span class="interest-tag">Reinforcement Learning</span>
  <span class="interest-tag">RAG</span>
  <span class="interest-tag">Knowledge Graph</span>
  <span class="interest-tag">EHR Reasoning</span>
  <span class="interest-tag">Continual Pretraining</span>
</div>

# 📖 Educations

<div class="timeline">
  <div class="timeline-item">
    <div class="timeline-dot"></div>
    <div class="timeline-content">
      <div class="timeline-date">2025.09 — now</div>
      <div class="timeline-title">Peking University · School of Computer Science</div>
      <div class="timeline-sub">Ph.D. in Computer Science and Technology</div>
    </div>
  </div>
  <div class="timeline-item">
    <div class="timeline-dot"></div>
    <div class="timeline-content">
      <div class="timeline-date">2021.09 — 2024.07</div>
      <div class="timeline-title">Peking University · School of Software and Microelectronics</div>
      <div class="timeline-sub">M.S. in Software Engineering</div>
    </div>
  </div>
  <div class="timeline-item">
    <div class="timeline-dot"></div>
    <div class="timeline-content">
      <div class="timeline-date">2017.09 — 2021.07</div>
      <div class="timeline-title">Nankai University · School of Cyberspace Security</div>
      <div class="timeline-sub">B.S. in Information Security &amp; LL.B. in Law (Dual Degree)</div>
    </div>
  </div>
</div>

# 🔥 News
- *2026.04*: &nbsp;🎉 Our ProMed is accepted by **<span style="color: red;">ACL 2026</span>** main conference. 
- *2026.04*: &nbsp;🎉 Our DFAMS is accepted by **<span style="color: red;">ACL 2026</span>** main conference. 
- *2026.01*: &nbsp;🎉 Our ADEPT is accepted by **<span style="color: red;">ICLR 2026</span>** conference. 
- *2026.01*: &nbsp;🎉 Our GPS is accepted by **<span style="color: red;">ICLR 2026</span>** conference. 
- *2025.11*: &nbsp;🎉 Our EAG-RL is accepted by **<span style="color: red;">AAAI 2026</span>** conference(oral). 
- *2025.08*: &nbsp;🎉 Our 3DS is accepted by **<span style="color: red;">EMNLP 2025</span>** main conference. 
- *2025.06*: &nbsp;🎉 Our TC-RAG is accepted **by <span style="color: red;">ACL 2025</span>** main conference(oral). 
- *2025.06*: &nbsp;🎉 Our HyKGE is accepted by **<span style="color: red;">ACL 2025</span>** main conference. 
- *2025.05*: &nbsp;🎉 Our HistoMOCO is accepted by **<span style="color: red;">Cells STAR Protocol 2025</span>**. 

# 📝 Publications 

<div class="stats-strip">
  <div class="stats-cards">
    <div class="stat-card" data-stat="papers">
      <div class="stat-value">0</div>
      <div class="stat-label">Total Papers</div>
    </div>
    <div class="stat-card" data-stat="first-author">
      <div class="stat-value">0</div>
      <div class="stat-label">First Author</div>
    </div>
    <div class="stat-card" data-stat="venues">
      <div class="stat-value">0</div>
      <div class="stat-label">Venues</div>
    </div>
    <div class="stat-card" data-stat="years">
      <div class="stat-value">0</div>
      <div class="stat-label">Active Years</div>
    </div>
  </div>
  <div class="sparkline-wrap">
    <div class="sparkline-label">Papers per year</div>
    <svg class="sparkline" viewBox="0 0 320 80" preserveAspectRatio="none"></svg>
  </div>
</div>

<div class="pub-filter">
  <button class="pub-filter-btn is-active" data-filter="all">All</button>
  <button class="pub-filter-btn" data-filter="year-2026">2026</button>
  <button class="pub-filter-btn" data-filter="year-2025">2025</button>
  <button class="pub-filter-btn" data-filter="iclr">ICLR</button>
  <button class="pub-filter-btn" data-filter="acl">ACL</button>
  <button class="pub-filter-btn" data-filter="aaai">AAAI</button>
  <button class="pub-filter-btn" data-filter="emnlp">EMNLP</button>
</div>

<div class='paper-box' data-year="2026" data-venue="iclr"><div class='paper-box-image'><div><div class="badge-red">ICLR 2026</div><img src='images/adept.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

[ADEPT: Continual Pretraining via Adaptive Expansion and Dynamic Decoupled Tuning](https://arxiv.org/pdf/2508.13514?)

Jinyang Zhang(co-first author), **Yue Fang**(co-first author), Hongxin Ding(co-first author), Weibin Liao(co-first author), Muyang Ye, Xu Chu, Junfeng Zhao, Yasha Wang

[**Code**](https://github.com/PuppyKnightUniversity/ADEPT) 

</div>
</div>

<div class='paper-box' data-year="2026" data-venue="iclr"><div class='paper-box-image'><div><div class="badge-red">ICLR 2026</div><img src='images/GPS.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

GPS: Graph-guided Proactive Information Seeking in Large Language Models

Ruiqing Li, Yongxin Xu, Xinke Jiang, Zhibang Yang, Xinyu Ma, **Yue Fang**, Junfeng Zhao, Yasha Wang, Xu Chu

</div>
</div>

<div class='paper-box' data-year="2026" data-venue="aaai"><div class='paper-box-image'><div><div class="badge-red">AAAI 2026</div><img src='images/eagrl.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

[Toward Better EHR Reasoning in LLMs: Reinforcement Learning with Expert Attention Guidance](https://arxiv.org/pdf/2508.13579?)


**Yue Fang**(co-first author), Yuxin Guo(co-first author), Jiaran Gao(co-first author), Hongxin Ding(co-first author), Xinke Jiang, Weibin Liao, Yongxin Xu, Yinghao Zhu, Zhibang Yang, Liantao Ma, Junfeng Zhao, Yasha Wang

[**Code**](https://github.com/devilran6/EAG-RL) 

</div>
</div>


<div class='paper-box' data-year="2025" data-venue="emnlp"><div class='paper-box-image'><div><div class="badge-red">EMNLP 2025</div><img src='images/3ds.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

[3DS: Decomposed Difficulty Data Selection's Case Study on LLM Medical Domain Adaptation](https://arxiv.org/pdf/2410.10901)

Hongxin Ding(co-first author), **Yue Fang**(co-first author), Runchuan Zhu(co-first author), Xinke Jiang, Jinyang Zhang, Yongxin Xu, Xu Chu, Junfeng Zhao, Yasha Wang

[**Code**](https://github.com/PuppyKnightUniversity/3DS) 

</div>
</div>



<div class='paper-box' data-year="2026" data-venue="acl"><div class='paper-box-image'><div><div class="badge-red">ACL 2026</div><img src='images/promed.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

[ProMed: Shapley Information Gain Guided Reinforcement Learning for Proactive Medical LLMs](https://arxiv.org/pdf/2508.13514?)

Hongxin Ding(co-first author), Baixiang Huang(co-first author), **Yue Fang**(co-first author), Weibin Liao, Xinke Jiang, Zheng Li, Junfeng Zhao, Yasha Wang

[**Code**](https://github.com/hxxding/ProMed) 

</div>
</div>


<div class='paper-box' data-year="2026" data-venue="acl"><div class='paper-box-image'><div><div class="badge-red">ACL 2026</div><img src='images/dfams.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

[DFAMS: Dynamic-flow guided Federated Alignment based Multi-prototype Search](https://www.arxiv.org/pdf/2508.20353)

Zhibang Yang, Xinke Jiang, Rihong Qiu, Ruiqing Li, Yihang Zhang, **Yue Fang**, Yongxin Xu, Hongxin Ding, Xu Chu, Junfeng Zhao, Yasha Wang

[**Code Repository Coming Soon**]

</div>
</div>

<div class='paper-box' data-year="2025" data-venue="acl"><div class='paper-box-image'><div><div class="badge-red">ACL 2025</div><img src='images/tcrag.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

[TC–RAG: Turing–Complete RAG’s Case study on Medical LLM Systems](https://aclanthology.org/2025.acl-long.558.pdf)

Xinke Jiang(co-first author), **Yue Fang**(co-first author), Rihong Qiu(co-first author), Haoyu Zhang, Yongxin Xu, Hao Chen, Wentao Zhang, Ruizhe Zhang, Yuchen Fang, Xinyu Ma,Xu Chu, Junfeng Zhao, Yasha Wang

[**Code**](https://github.com/Artessay/TC-RAG) 

</div>
</div>

<div class='paper-box' data-year="2025" data-venue="acl"><div class='paper-box-image'><div><div class="badge-red">ACL 2025</div><img src='images/hykge.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

[HyKGE: A Hypothesis Knowledge Graph Enhanced RAG Framework for Accurate and Reliable Medical LLMs Responses](https://aclanthology.org/2025.acl-long.580.pdf)

Xinke Jiang, Ruizhe Zhang, Yongxin Xu, Rihong Qiu, **Yue Fang**, Zhiyuan Wang, Jinyi Tang, Hongxin Ding, Xu Chu, Junfeng Zhao, Yasha Wang

[**Code**](https://github.com/Artessay/HyKGE) 

</div>
</div>


<div class='paper-box' data-year="2025" data-venue="other"><div class='paper-box-image'><div><div class="badge-red">Cells STAR Protocol 2025</div><img src='images/starprotocol.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

[Protocol for detecting oral squamous cell carcinoma in histopathology images using the momentum contrast framework](https://pdf.sciencedirectassets.com/776467/1-s2.0-S2666166725X00034/1-s2.0-S2666166725003430/main.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHgaCXVzLWVhc3QtMSJHMEUCIH02c59b%2B0wgFDHkv5CV4QRTZJ907oMO3kKQYK0FEJrDAiEAtfEnOIzuEX%2BmL6UsLCxWDR6DWZHh8f9yZaYRMTAMmDsquwUI0f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAFGgwwNTkwMDM1NDY4NjUiDBOISVqiNYHOv%2BVfJSqPBZKl%2F%2FvQ5aq5BoeDFZsiUo3Ln7uss%2BMa2YNNws8YrnLX%2FRGwiQdp2IiCUsLD3qvm0T7f7Nk3ox%2BZhmSHOJMRdvnK8J31DjFpKJI6D%2FD4%2FZN6BZedox%2Fuob6wyb%2FFFmF0kw8kyiVNx1yHjwY0fgzryNsrstg87ZDdGt969FNjFUlY0FWLf21lUzYyy7sOVxa7dZJkzGuP%2FKMrc0vbEXQcUHBbponjFkgconMioTFseH%2F23UYfIgGNY6trySvzJyMMQ62Ik30wU1bc9Bkuywp0rQ1ElM7s4%2BRFtgl51P08Q%2FWQ7bWKEezopg1OeuP2Li3wHsBG%2BHtP%2BPjWiFVUHZcBdCigSomIAC0WvXeeF%2B71HlBnpaPlwN28ZT8zEEQCUinjRoanpVmZZEFv7G4EMf13U5ZfkIF5EAueq3J9d5Oelj5bwYRIR4uOdnQ2j0xRKmPLr3SA1P3JxCPWkj5OAmBO5LG9XYcI8XVSz7PQWrpZgGLPXymPUWjqV%2BPSEXxy%2FgDn1oko%2F4jf1VSC2nDAlqFqZvEL1dYLhrp2f2mpmRVnO9jSEqhMUmgnC1zp5FD8iaF5WJsMTxFdZVM%2FSWaViOir%2BIqfRj9oxu3%2FVrJFj0oTabvKlp6waBSPqGQZBjDYU93GH7a5pnYf6ZrD93Afm8xSUUq7BkXO5%2BDHO9OyB0zbf%2FdF0TSuJcWchjvWpvPix0oRkNXhs01BLQznFJYfoNNUE72FEO1YyqG0UElNB9mgRVYUouoVOd3S%2BjY2v2d8r5TAUPJUGkto3wtQ6nSKWr62dqP1vPvl8AW3cQxQb8z%2BsOrQySgRbDVTy%2BuM2qWoesuz%2F3K1VS3%2FHTTdXpkKDN3La%2BkL13VRvc1GFWWYcwDSxqQwvt%2FKxQY6sQFoHZwb0OfQe6s2fVWOF8gji5%2FrhmsTT3ZENBepI868mahUGK25sugBO88GmUZjZ%2Fqg2l86xRHocPNFl%2BMcKmDwUgB8hKjBuuGnaBdez7Sea2QThNddXfNdIEOP7gn6O8pyNEuuuwBXYfy2%2BEEFeusU0Iad%2FRzVdCMWjIN8eXQu2sON9JRVtcLnUUcXV17TgpAaQOQd4K1ZS0sgvbUS%2FrBqfazegq6h%2Fe8y0AdNzOgH4PE%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250830T081947Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAQ3PHCVTYRC4XXMLW%2F20250830%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=1ca8d64e0cd1f47d0a8b33391c2c94d3830fcbd7a0d76a76051426528b066571&hash=77b7a2804747bffbb312fdc9a853c66425074a54088b6f90184e897a7a2534ad&host=68042c943591013ac2b2430a89b270f6af2c76d8dfd086a07176afe7c76c2c61&pii=S2666166725003430&tid=spdf-34fefbfc-70c2-42f7-9307-9e106458b368&sid=8ed9450f5b366645555855c60af9c188c061gxrqa&type=client&tsoh=d3d3LnNjaWVuY2VkaXJlY3QuY29t&rh=d3d3LnNjaWVuY2VkaXJlY3QuY29t&ua=16145857515d020152&rr=9772dd7afcf82f1c&cc=us)

Xiaoyun Zhang, **Yue Fang**, Weibin Liao, Junyi Ma, Xin Gao, Min Gao, Junfeng Zhao

[**Code**](https://github.com/Heyffff/HistoMoCo) 

</div>
</div>



