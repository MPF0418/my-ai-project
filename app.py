from flask import Flask
app = Flask(__name__)

@app.route('/')
def home():
    return """
    <h1>🎉 部署成功！</h1>
    <p>如果你能看到这段文字，说明 GitHub Codespaces 公网访问已打通</p>
    <p>现在可以把这段代码换成 AI 给你的复杂代码了</p>
    """

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
