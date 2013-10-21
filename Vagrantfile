# -*- mode: ruby -*-
# vi: set ft=ruby :

# TODO: use our recipe for tika
$script = <<SCRIPT
//>script inline
sudo apt-get install python-software-properties -y;
sudo apt-add-repository ppa:libreoffice/libreoffice-4-0;
sudo apt-get update;
sudo apt-get install libreoffice -y;
SCRIPT

Vagrant.configure("2") do |config|
  config.vm.hostname = "cluestrhydrateroffice"

  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"

  config.vm.network :forwarded_port, host: 8000, guest: 8000

  config.berkshelf.berksfile_path = "./Berksfile"
  config.berkshelf.enabled = true
  config.omnibus.chef_version = '11.6.0'

  config.vm.provision :chef_solo do |chef|
    chef.run_list = [
      "recipe[apt]",
      "recipe[nodejs]",
    ]
  end

  config.vm.provision :shell,
      :inline => $script
end
