import flask
from flask import request, jsonify
from flask_cors import CORS, cross_origin
import NLP
import numpy as np
import pandas as pd
import re
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity


app = flask.Flask(__name__)
app.config["DEBUG"] = True
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

excel_file_path = r'C:\Users\Me\Desktop\SearchApi\soalat.xlsx'
library = pd.read_excel(excel_file_path)
library = library.astype(str)

def preprocess(text):
    text = re.sub(r'\W+', ' ', text.lower())
    return text

library['question'] = library['question'].apply(preprocess)

vectorizer = CountVectorizer (analyzer='char', ngram_range=(2, 4))
vectorizer.fit(library['question'])

transformedVector = vectorizer.transform(library['question'])

def autocomplete(query):
    query = preprocess(query)
    
    similarities = cosine_similarity(vectorizer.transform([query]), transformedVector).flatten()
    
    indices = np.argsort(similarities)[::-1]
    
    top_matches = [(library.iloc[i]['question'], similarities[i]) for i in indices[:10]]
    
    ordered_results = []
    exact_match_results = []
    
    for match in top_matches:
        question = match[0]
        if question.startswith(query) or vectorizer.transform([query]).multiply(vectorizer.transform([question])).sum() > 0:
            exact_match_results.append(match)
        else:
            ordered_results.append(match)
    
    ordered_results = exact_match_results + ordered_results
    
    return ordered_results

@cross_origin()
@app.route("/search/<word>", methods=['GET'])
def get_suggenstions_by_word_in_path(word):
    suggestions = NLP.autocomplete(word);
    return jsonify(suggestions)

app.run(debug=True, port=8001)