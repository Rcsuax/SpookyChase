terraform {
  required_version = ">= 1.5"
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.52"
    }
  }
}

provider "hcloud" {
  token = var.hcloud_token
}

resource "hcloud_ssh_key" "default" {
  name       = "chase-deploy"
  public_key = file(pathexpand(var.ssh_public_key_path))
}

resource "hcloud_firewall" "web" {
  name = "chase-web"

  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "22"
    source_ips = var.ssh_allowed_ips
  }

  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "80"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "443"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
}

resource "hcloud_server" "chase" {
  name         = "chase"
  server_type  = var.server_type
  image        = "ubuntu-24.04"
  location     = var.location
  ssh_keys     = [hcloud_ssh_key.default.id]
  firewall_ids = [hcloud_firewall.web.id]

  # Installs Node + Caddy, clones and builds the app, and runs it under systemd
  user_data = templatefile("${path.module}/cloud-init.yaml.tftpl", {
    repo_url   = var.repo_url
    branch     = var.branch
    site       = var.domain != "" ? var.domain : ":80"
    app_port   = 3000
    node_major = 22
  })

  # Changing the bootstrap script should not silently rebuild the server
  lifecycle {
    ignore_changes = [user_data]
  }
}
