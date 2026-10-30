output "ipv4" {
  description = "Point your domain's A record here"
  value       = hcloud_server.chase.ipv4_address
}

output "ipv6" {
  value = hcloud_server.chase.ipv6_address
}

output "url" {
  value = var.domain != "" ? "https://${var.domain}" : "http://${hcloud_server.chase.ipv4_address}"
}

output "ssh" {
  value = "ssh root@${hcloud_server.chase.ipv4_address}"
}
