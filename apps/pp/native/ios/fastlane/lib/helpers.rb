require "date"
require "uri"

def to_boolean(str)
  str == 'true'
end

def get_firebase_cli_path
  path = `which firebase`

  if (path.empty?)
    puts "No firebase cli found."
    exit 1
  end

  path
end

def get_current_git_branch
  ENV['GIT_BRANCH'] or `git branch --show-current`.strip!
end

def is_running_in_jenkins
  !!ENV['BUILD_URL']
end

def is_running_in_gh
  !!ENV['IS_GH']
end

def validate_env_variables
  required_keys = [
    "FASTLANE_PASSWORD",
    "MATCH_PASSWORD",
    "FIREBASE_CI_KEY",
    "MATCH_KEYCHAIN_NAME",
    "MATCH_KEYCHAIN_PASSWORD"
  ]
  required_keys.each do |key|
    puts "Validating #{key}"

    if !key
      puts "Error: Missing environment key: #{key}."
      exit 1
    end
  end
end

def get_release_notes
  last_commit_message = `git log -1 --author='^(?!Jenkins).*$' --perl-regexp --format="%s \ncommit hash: %h\ncommitter name: %cn\n"`.strip!
  current_git_branch = get_current_git_branch

  git_message = "#{last_commit_message}\nbranch: #{current_git_branch}"

  if is_running_in_gh
    gh_build_url = "Github Build URL: " + ENV['BUILD_URL']
    gh_build_tag = "Github Build TAG: " + ENV['IOS_BUILD_NUMBER']
    return git_message + "\n" + gh_build_url + "\n" + gh_build_tag
  end

  return git_message
end

def get_release_notes_gaming
  git_message = " - branch: #{get_current_git_branch}"

  if is_running_in_jenkins
    git_message = git_message + "\n - Jenkins Build URL: " + ENV['BUILD_URL']
  end
  git_message
end

def get_build_number
  ENV['IOS_BUILD_NUMBER']
end

def get_encoded_build_number_label
  build_number = get_build_number
  return "%23#{build_number}" if !!build_number
  return 'Local'
end

# This method updates the app default version and build numbers to a version given as input or get_build_number
def update_app_version(version = nil)
  build_number = version.nil? || version.to_s.empty? ? get_build_number : version

  FastlaneCore::UI.important "Updating app version ⏭  #{build_number}..."

  increment_version_number(
    version_number: get_build_number
  )
  increment_build_number(
    build_number: build_number
  )
end
