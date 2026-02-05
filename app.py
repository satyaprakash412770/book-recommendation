import gradio as gr
from recommender import recommend_books

# User-friendly redesign with clean, readable interface
with gr.Blocks() as interface:
    # Embed CSS for user-friendly design
    gr.HTML("""
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Open+Sans:wght@400;600&display=swap');

        /* Clean, light background */
        body, .gradio-container {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
            font-family: 'Open Sans', sans-serif !important;
        }

        /* Header - clean and inviting */
        .main-header {
            text-align: center;
            padding: 3rem 1.5rem 2rem;
            margin-bottom: 2rem;
            background: white;
            border-radius: 15px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.08);
        }

        .main-header h1 {
            font-family: 'Poppins', sans-serif !important;
            font-size: 2.5rem !important;
            font-weight: 700 !important;
            color: #2c3e50 !important;
            margin-bottom: 0.75rem !important;
            letter-spacing: -0.5px;
        }

        .main-header .emoji {
            font-size: 3rem;
            margin-bottom: 0.5rem;
        }

        .main-header p {
            color: #5a6c7d !important;
            font-size: 1.15rem !important;
            margin-top: 0.5rem !important;
            line-height: 1.6;
        }

        .main-header .subtitle {
            color: #7f8c9a !important;
            font-size: 1rem !important;
            margin-top: 0.75rem !important;
        }

        /* Input section - clean white card */
        .input-card {
            background: white !important;
            border-radius: 12px !important;
            padding: 2rem !important;
            box-shadow: 0 2px 15px rgba(0,0,0,0.08) !important;
            margin-bottom: 1.5rem !important;
        }

        label {
            color: #2c3e50 !important;
            font-weight: 600 !important;
            font-size: 1.1rem !important;
            margin-bottom: 0.75rem !important;
            display: block !important;
        }

        textarea, input {
            background: #f8f9fa !important;
            border: 2px solid #dee2e6 !important;
            border-radius: 10px !important;
            padding: 1rem !important;
            font-size: 1rem !important;
            color: #2c3e50 !important;
            line-height: 1.6 !important;
            transition: all 0.3s ease !important;
        }

        textarea:focus, input:focus {
            background: white !important;
            border-color: #4a90e2 !important;
            box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.1) !important;
            outline: none !important;
        }

        /* Buttons - clear and inviting */
        button {
            border-radius: 10px !important;
            font-weight: 600 !important;
            font-size: 1.05rem !important;
            padding: 0.875rem 2rem !important;
            transition: all 0.3s ease !important;
            font-family: 'Poppins', sans-serif !important;
        }

        button.primary {
            background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%) !important;
            color: white !important;
            border: none !important;
            box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3) !important;
        }

        button.primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4) !important;
        }

        button.secondary {
            background: white !important;
            color: #5a6c7d !important;
            border: 2px solid #dee2e6 !important;
        }

        button.secondary:hover {
            border-color: #4a90e2 !important;
            color: #4a90e2 !important;
            background: #f8f9fa !important;
        }

        /* Output cards - excellent readability */
        .markdown, .prose {
            background: white !important;
            padding: 2.5rem !important;
            border-radius: 12px !important;
            box-shadow: 0 2px 15px rgba(0,0,0,0.08) !important;
            border: none !important;
            margin-top: 1.5rem !important;
            line-height: 1.8 !important;
        }

        /* Book recommendation cards */
        .markdown h3, .prose h3 {
            color: #2c3e50 !important;
            font-family: 'Poppins', sans-serif !important;
            border-bottom: 3px solid #4a90e2 !important;
            padding-bottom: 0.75rem !important;
            margin: 2rem 0 1.5rem 0 !important;
            font-size: 1.6rem !important;
            font-weight: 600 !important;
        }

        .markdown h3:first-child, .prose h3:first-child {
            margin-top: 0 !important;
        }

        .markdown p, .prose p {
            color: #4a5568 !important;
            line-height: 1.8 !important;
            margin: 0.75rem 0 !important;
            font-size: 1.05rem !important;
        }

        .markdown strong, .prose strong {
            color: #2c3e50 !important;
            font-weight: 600 !important;
        }

        .markdown em, .prose em {
            color: #5a6c7d !important;
        }

        /* Book cover images */
        .markdown img, .prose img {
            border-radius: 10px !important;
            box-shadow: 0 8px 20px rgba(0,0,0,0.12) !important;
            max-width: 200px !important;
            margin: 1.5rem 0 !important;
            border: none !important;
        }

        /* Links - clear and friendly */
        .markdown a, .prose a {
            color: #4a90e2 !important;
            font-weight: 600 !important;
            text-decoration: none !important;
            border-bottom: 2px solid transparent !important;
            transition: all 0.2s ease !important;
        }

        .markdown a:hover, .prose a:hover {
            color: #357abd !important;
            border-bottom: 2px solid #4a90e2 !important;
        }

        /* Book descriptions - easy to read */
        .markdown blockquote, .prose blockquote {
            background: #f8f9fa !important;
            border-left: 4px solid #4a90e2 !important;
            padding: 1.5rem !important;
            margin: 1.5rem 0 !important;
            border-radius: 8px !important;
            color: #4a5568 !important;
            line-height: 1.8 !important;
            font-size: 1rem !important;
        }

        .markdown hr, .prose hr {
            border: none !important;
            border-top: 2px solid #e9ecef !important;
            margin: 2.5rem 0 !important;
        }

        /* Examples section */
        .examples {
            background: white !important;
            padding: 1.5rem !important;
            border-radius: 12px !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05) !important;
            margin: 1.5rem 0 !important;
        }

        /* Footer - subtle and clean */
        footer {
            text-align: center;
            color: #7f8c9a !important;
            padding: 2rem;
            margin-top: 3rem;
            font-size: 0.95rem;
        }

        /* Container improvements */
        .container {
            max-width: 900px !important;
            margin: 0 auto !important;
            padding: 0 1rem !important;
        }

        /* Responsive design */
        @media (max-width: 768px) {
            .main-header h1 {
                font-size: 2rem !important;
            }
            
            .markdown, .prose {
                padding: 1.5rem !important;
            }

            .input-card {
                padding: 1.5rem !important;
            }
        }
        </style>
        
        <div class="main-header">
            <div class="emoji">📚</div>
            <h1>Book Recommender</h1>
            <p>Discover your next favorite book with AI-powered recommendations</p>
            <p class="subtitle">Simply describe what you're looking for, and we'll find the perfect match</p>
        </div>
    """)
    
    # Input section
    with gr.Group(elem_classes="input-card"):
        user_input = gr.Textbox(
            label="What kind of book would you like to read?",
            placeholder="Example: I'm looking for a science fiction novel about space exploration with strong characters and philosophical themes...",
            lines=4,
            max_lines=8
        )
        
        with gr.Row():
            submit_btn = gr.Button("🔍 Find My Books", variant="primary", size="lg", scale=3)
            clear_btn = gr.Button("Clear", variant="secondary", size="lg", scale=1)
    
    # Examples
    gr.Examples(
        examples=[
            ["A captivating mystery with unexpected twists"],
            ["Inspiring biography of a historical figure"],
            ["Fantasy adventure with magic and dragons"],
            ["Romance novel set in a small town"],
            ["Science fiction exploring future technology"]
        ],
        inputs=user_input,
        label="✨ Quick Ideas"
    )
    
    # Output
    output = gr.Markdown(
        label="📖 Your Personalized Recommendations",
        value="*Your book recommendations will appear here. Start by describing your ideal book above!*"
    )
    
    # Footer
    gr.HTML("""
        <footer>
            <p>✨ Powered by Google Books API and Advanced AI Semantic Search ✨</p>
            <p style="margin-top: 0.5rem; font-size: 0.85rem;">Finding the perfect book, one search at a time</p>
        </footer>
    """)
    
    # Event handlers
    submit_btn.click(
        fn=recommend_books,
        inputs=user_input,
        outputs=output
    )
    
    clear_btn.click(
        lambda: ("", "*Your book recommendations will appear here. Start by describing your ideal book above!*"),
        outputs=[user_input, output]
    )
    
    user_input.submit(
        fn=recommend_books,
        inputs=user_input,
        outputs=output
    )

# Launch
interface.launch()
