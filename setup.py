from setuptools import setup

setup(
    name="repl-nix-workspace",
    version="0.1.0",
    description="Add your description here",
    python_requires=">=3.10",
    py_modules=["app", "main"],
    install_requires=[
        "email-validator>=2.2.0",
        "flask-cors>=6.0.0",
        "flask>=3.1.1",
        "flask-sqlalchemy>=3.1.1",
        "gunicorn>=23.0.0",
        "psycopg2-binary>=2.9.10",
        "python-dotenv>=1.1.0",
        "replicate>=1.0.6",
        "werkzeug>=3.1.3",
        "requests>=2.32.3",
    ],
) 