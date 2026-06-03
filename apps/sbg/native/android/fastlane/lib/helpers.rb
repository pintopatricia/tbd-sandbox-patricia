def is_running_in_jenkins
  !!ENV['BUILD_NUMBER']
end

def get_current_git_branch
  ENV['GIT_BRANCH'] or `git branch --show-current`.strip!
end

def validate_env_variables
  required_keys = [
    'FIREBASE_CI_KEY',
  ]

  required_keys.each do |key|
    puts "Validating #{key}"

    if (!key)
      puts "Error: Missing environment key: #{key}."
      exit 1
    end
  end
end

def get_release_notes
  last_commit_message = `git log -1 --author='^(?!Jenkins).*$' --perl-regexp --format="commit message: %s \ncommit hash: %h\ncommitter name: %cn\n"`.strip!
  current_git_branch = get_current_git_branch

  git_message = "\n#{last_commit_message}\nbranch: #{current_git_branch}"

  if (is_running_in_jenkins)
    jenkins_build_url = "Jenkins Build URL: " + ENV['BUILD_URL']
    jenkins_build_tag = "Jenkins Build TAG: " + ENV['BUILD_TAG']
    return git_message + "\n" + jenkins_build_url + "\n" + jenkins_build_tag
  end

  return git_message
end

def get_release_notes_from_file
  file = File.open("release_notes.txt", chomp: true)
  return file.read
end

def get_encoded_build_number_label
  return 'Local'
end
