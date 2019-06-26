#!groovy
def versionPrefix = '1'
def version = "${versionPrefix}.${BUILD_NUMBER}.0"
node {
stage('Set Version')
{
currentBuild.displayName = " face-recognition ${version}"
}
stage('install')
{
dir('C://Program Files (x86)//Jenkins//workspace//face-recognition')
{
bat 'npm install'
bat 'npm run-script build'
}

} 
stage('zipping')
{
dir('C:\\Program Files (x86)\\Jenkins\\workspace\\face-recognition\\build')
{
bat "7z a face-recognitionUI${version}.zip"
}
}
stage ('Upload to Jfrog')
{
echo 'Pushing to Jfrog'
dir('C:/Program Files (x86)/Jenkins/workspace/face-recognition/build')
{
def server = Artifactory.server('Jfrog')
def uploadSpec = """{
"files": [
{
"pattern": "*.zip",
"target": "face-recognitionUI",                   
"recursive": "true",
"flat": "false"
}
]
}"""
server.upload spec: uploadSpec
}
}
stage('calling CD')
{
echo "${version}"
def results = build job: 'face-recognition(ans)', parameters: [string(name: 'version', value: "${version}")]
}   
}
