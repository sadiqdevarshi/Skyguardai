$ErrorActionPreference = "Stop"

$scriptDir = (Get-Item -Path $PSScriptRoot).FullName
$wrapperJar = (Get-Item -Path "$PSScriptRoot\.mvn\wrapper\maven-wrapper.jar").FullName

$prop = "-Dmaven.multiModuleProjectDirectory=$scriptDir"
& java $prop -cp "$wrapperJar" org.apache.maven.wrapper.MavenWrapperMain $args
