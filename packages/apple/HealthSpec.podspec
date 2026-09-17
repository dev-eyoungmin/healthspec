require 'json'

versions = JSON.parse(File.read(File.join(__dir__, '..', '..', 'healthspec-versions.json')))

Pod::Spec.new do |s|
  s.name           = 'HealthSpec'
  s.version        = versions['apple']
  s.summary        = 'HealthKit implementation of the HealthSpec specification.'
  s.description    = 'Type system, platform mapping tables and HealthKit helpers generated from the HealthSpec specification.'
  # Published from the repository root: `pod trunk push packages/apple/HealthSpec.podspec`. Paths below are relative
  # to the root of the git source, not to this file.
  s.license        = { type: 'MIT', file: 'LICENSE' }
  s.author         = 'HealthSpec contributors'
  s.homepage       = 'https://github.com/dev-eyoungmin/healthspec'
  s.platforms      = { :ios => '15.1' }
  s.swift_version  = '5.9'
  s.source         = { git: 'https://github.com/dev-eyoungmin/healthspec.git', tag: "apple-#{s.version}" }

  s.frameworks   = 'HealthKit'
  s.source_files = 'packages/apple/Sources/HealthSpec/**/*.swift'
end
