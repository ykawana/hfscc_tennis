# Go Development Container
# https://github.com/devcontainers/images/tree/main/src/go

ARG VARIANT="1.26-trixie"
FROM mcr.microsoft.com/devcontainers/go:${VARIANT}

# =============================================================================
# Install Go (override base image version)
# 
# Microsoft の devcontainer イメージは Go の最新バージョンへの追従が遅いため、
# gosec が要求するバージョンとイメージ同梱のバージョンに差分が生じることがある。
# その場合、gosec が Go 標準ライブラリの脆弱性を検出してビルドが失敗するため、
# ここで明示的に最新バージョンをインストールしている。
#
# 例: devcontainer イメージ同梱 → Go 1.26.1
#     gosec が要求            → Go 1.26.2
# =============================================================================
ARG GO_VERSION="1.26.2"
RUN rm -rf /usr/local/go \
  && curl -fsSL "https://go.dev/dl/go${GO_VERSION}.linux-$(dpkg --print-architecture).tar.gz" \
  | tar -C /usr/local -xz


# =============================================================================
# Node.js installation (optional)
# =============================================================================
ARG NODE_VERSION="none"
RUN if [ "${NODE_VERSION}" != "none" ]; then \
  su vscode -c "umask 0002 && . /usr/local/share/nvm/nvm.sh && nvm install ${NODE_VERSION} 2>&1"; \
  fi

# =============================================================================
# System packages (single apt layer)
# =============================================================================
RUN rm -f /etc/apt/sources.list.d/yarn.list \
  && apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get -y install --no-install-recommends \
  apt-transport-https \
  bash-completion \
  curl \
  gettext-base \
  gnupg \
  lsb-release \
  python3 \
  python3-venv \
  tree \
  uuid-runtime \
  wget \
  && apt-get autoremove -y \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*

# =============================================================================
# uv (Rust 製 Python パッケージマネージャ)
#
# pip / pip-tools を経由せずバイナリ単体で動作するため、
# Python パッケージマネージャ自体を介したサプライチェーン攻撃のリスクを緩和できる。
# =============================================================================
COPY --from=ghcr.io/astral-sh/uv:0.11.5 /uv /usr/local/bin/uv

# =============================================================================
# Python virtual environment and packages
# python は、 aws sam CLI が python ベースであるため、インストールする。
# マニュアルで追加するパッケージは、requirements.in に登録を行う。
# requirements.txt は以下のコマンドで、サプライチェーン全体に対するピン留めを行う。
# uv pip compile --generate-hashes -o requirements.txt requirements.in
# =============================================================================
COPY requirements.txt /tmp/requirements.txt
RUN uv venv /venv \
  && uv pip install --python /venv/bin/python --require-hashes --no-cache -r /tmp/requirements.txt \
  && rm /tmp/requirements.txt

ENV PATH=/venv/bin:${PATH} \
  VIRTUAL_ENV=/venv

#   warrant \
#   pyjwt


# =============================================================================
# Go tools (single layer for efficiency)
# =============================================================================
RUN curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $(go env GOPATH)/bin \
  && go install golang.org/x/tools/cmd/godoc@latest \
  && go install golang.org/x/tools/cmd/goimports@latest \
  && go install golang.org/x/vuln/cmd/govulncheck@latest \
  && go install github.com/boumenot/gocover-cobertura@latest \
  && go install go.uber.org/mock/mockgen@latest \
  && go install github.com/securego/gosec/v2/cmd/gosec@latest \
  && go install github.com/google/go-licenses@latest \
  && go install github.com/mikefarah/yq/v4@latest \
  && rm -rf /go/pkg/mod/cache

# =============================================================================
# trivy
# trivy は、 version 0.69.3 でピン留め
# =============================================================================
ENV TRIVY_VERSION="0.69.3"
RUN DPKG_ARCH=$(dpkg --print-architecture) \
  && if [ "$DPKG_ARCH" = "amd64" ]; then TRIVY_ARCH="64bit"; elif [ "$DPKG_ARCH" = "arm64" ]; then TRIVY_ARCH="ARM64"; else TRIVY_ARCH="$DPKG_ARCH"; fi \
  && TRIVY_DEB="trivy_${TRIVY_VERSION}_Linux-${TRIVY_ARCH}.deb" \
  && curl -fsSL -o /tmp/${TRIVY_DEB} \
  "https://github.com/aquasecurity/trivy/releases/download/v${TRIVY_VERSION}/${TRIVY_DEB}" \
  && curl -fsSL -o /tmp/trivy_checksums.txt \
  "https://github.com/aquasecurity/trivy/releases/download/v${TRIVY_VERSION}/trivy_${TRIVY_VERSION}_checksums.txt" \
  && cd /tmp \
  && grep "${TRIVY_DEB}" trivy_checksums.txt | sha256sum -c - \
  && dpkg -i ${TRIVY_DEB} \
  && rm -f ${TRIVY_DEB} trivy_checksums.txt

# =============================================================================
# Node.js global packages (OpenAPI / JSON Schema tools)
# =============================================================================
# swagger-merger : openapi.yaml を分割管理する際のファイル統合ツール
# swagger-cli :    openapi.yaml の validation tool (spectral へ以降予定)
# spectral :       openapi.yaml の validation tool
# newman :         E2E Test Tool
# ajv-cli :        json schema の validation tool
# ajv-formats :    ajv-cli で用いる format 定義プラグイン
RUN npm install -g \
  ajv-cli \
  ajv-formats \
  newman \
  swagger-merger \
  swagger-cli \
  @redocly/cli \
  @stoplight/spectral-cli \
  && npm cache clean --force

# =============================================================================
# Claude Code CLI (standalone binary)
# =============================================================================
RUN curl -fsSL https://claude.ai/install.sh | bash

# git-completion.bash
RUN mkdir -p /root/.config/git && \
  curl -fsSL https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash \
  -o /root/.config/git/git-completion.bash
