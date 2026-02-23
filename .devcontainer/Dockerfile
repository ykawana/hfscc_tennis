# [Choice] Go variant. Keep OS pinned (bookworm) and float only Go minor version.
# To refresh the base image locally before rebuild:
#   docker pull mcr.microsoft.com/vscode/devcontainers/go:1-bookworm
ARG VARIANT="1.25-bookworm"
FROM mcr.microsoft.com/vscode/devcontainers/go:${VARIANT}

# [Choice] Node.js version: none, lts/*, 16, 14, 12, 10
ARG NODE_VERSION="none"
RUN if [ "${NODE_VERSION}" != "none" ]; then su vscode -c "umask 0002 && . /usr/local/share/nvm/nvm.sh && nvm install ${NODE_VERSION}"; fi

# System packages (consolidated into a single apt-get update)
RUN apt-get update \
  && export DEBIAN_FRONTEND=noninteractive \
  && apt-get -y install --no-install-recommends \
  uuid-runtime \
  tree \
  bash-completion \
  wget \
  apt-transport-https \
  gnupg \
  lsb-release \
  python3 \
  python3-venv \
  gettext-base \
  && apt-get autoremove -y && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Trivy (vulnerability scanner)
RUN wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | gpg --dearmor -o /usr/share/keyrings/trivy.gpg \
  && echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/trivy.list \
  && apt-get update \
  && apt-get -y install --no-install-recommends trivy \
  && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# yq (golang version)
ENV YQ_VERSION=v4.25.3
RUN ARCH=$(arch) \
  && if [ "$ARCH" = "aarch64" ]; then BINARY="yq_linux_arm64"; else BINARY="yq_linux_amd64"; fi \
  && curl -L -o /tmp/${BINARY}.tar.gz https://github.com/mikefarah/yq/releases/download/${YQ_VERSION}/${BINARY}.tar.gz \
  && tar -zxf /tmp/${BINARY}.tar.gz -C /tmp \
  && mv /tmp/${BINARY} /usr/bin/yq \
  && rm -f /tmp/${BINARY}.tar.gz

# Go tools (single layer)
RUN go install golang.org/x/tools/cmd/godoc@latest \
  && go install github.com/boumenot/gocover-cobertura@latest \
  && go install go.uber.org/mock/mockgen@latest \
  && go install github.com/securego/gosec/v2/cmd/gosec@latest \
  && go install golang.org/x/tools/cmd/goimports@latest \
  && go install golang.org/x/lint/golint@latest \
  && go install github.com/google/go-licenses@latest \
  && go install golang.org/x/vuln/cmd/govulncheck@latest

# Python virtual environment
RUN python3 -m venv /opt/venv \
  && /opt/venv/bin/pip install --upgrade pip \
  && /opt/venv/bin/pip install \
  cfn-lint \
  boto3 \
  warrant \
  pyjwt

ENV PATH=/opt/venv/bin:${PATH} \
  VIRTUAL_ENV=/opt/venv

# Node.js global packages
# swagger-merger : openapi.yaml を分割管理する際のファイル統合ツール
# swagger-cli :    openapi.yaml の validation tool (spectral へ移行予定)
# spectral :       openapi.yaml の validation tool
# newman :         E2E Test Tool
RUN npm install -g swagger-merger \
  swagger-cli \
  @stoplight/spectral \
  newman

# git-completion.bash
RUN mkdir -p /root/.config/git && \
  curl -fsSL https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash \
  -o /root/.config/git/git-completion.bash
