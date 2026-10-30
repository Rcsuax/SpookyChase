variable "hcloud_token" {
  description = "Hetzner Cloud API token (Console → Project → Security → API tokens, read & write)"
  type        = string
  sensitive   = true
}

variable "repo_url" {
  description = "Git URL to clone. For a private GitHub repo use https://<token>@github.com/you/chase.git"
  type        = string
  sensitive   = true
}

variable "branch" {
  description = "Branch to deploy"
  type        = string
  default     = "main"
}

variable "domain" {
  description = "Domain pointed at the server (enables HTTPS). Leave empty to serve plain HTTP on port 80"
  type        = string
  default     = ""
}

variable "ssh_public_key_path" {
  description = "Public key to install for root"
  type        = string
  default     = "~/.ssh/rcsuax-gh.pub"
}

variable "ssh_allowed_ips" {
  description = "CIDRs allowed to SSH in"
  type        = list(string)
  default     = ["0.0.0.0/0", "::/0"]
}

variable "server_type" {
  description = "Hetzner server type (see `hcloud server-type list`)"
  type        = string
  default     = "cx23"
}

variable "location" {
  description = "Hetzner location: nbg1, fsn1, hel1, ash, hil, sin"
  type        = string
  default     = "nbg1"
}
