from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import markdown
client = OpenAI(api_key="xxx", base_url="https://api.deepseek.com") # api_key要修改
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    question = request.form.get('question')
    model = request.form.get('model', 'v3')  # Default to 'v3' if no model is provided
    model_adjustment = request.form.get('modelAdjustment', '')  # Get the model adjustment if provided

    if model == 'v3':
        model_name = "deepseek-chat"
    elif model == 'r1':
        model_name = "deepseek-reasoner"
    else:
        model_name = "deepseek-chat"

    system_content = "你是deepseek人工智能中文小助手，你每次回复的token数不得超过200,你要以markdown的方式回复我"
    if model_adjustment:
        system_content = f" {model_adjustment}"+",你每次回复的token数不得超过200，你要以markdown的方式回复我"
        print("Now the system content is:"+system_content)

    response = client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "system", "content": system_content},
            {"role": "user", "content": question},
        ],
        stream=False
    )
    return jsonify({'answer': markdown.markdown(response.choices[0].message.content)})

if __name__ == '__main__':
    app.run(debug=True)
