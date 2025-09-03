This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000] with your browser to see the result.

- First Step:
    - You need install Next project with command: "npx create-next-app@latest ." to install the latest version from Next.

- Second Step:
    - You need install Radix UI, come with components for example: scroll-chat and dialog.
    - The command is "npm install @radix-ui/react-dialog @radix-ui/react-scroll-area"
    - uuid is necessary because user have a unique id.
    - You need install rasa in other folder. "pip install rasa"
    - After that, "rasa init" to init rasa and all files from rasa is ready.
    - Rasa server starts after the command "rasa run --cors *". --cors allows both frontend on port 3000 and rasa on port 5005 to run simultaneously and allows communication with then.
    - After Rasa API and Front-end connected, go make a django API.
    - Use the command "pip install django djangorestframework. The most used for make API Rest with django.
    - In django, the normal is have a project and one or some apps.
    - First create a django project with "django-admin startproject {name_project} ."
    - After create a app with "python manage.py startapp {name_app}"
    - After that ou need config django to support the new app and new project. Go to settings.py and add in installed apps only.
    - Need change views.py to support prompt, user_message, rasa_prompts and others.
    - Install ollama and deepseek-coder with command "ollama run deepseek-coder:1.3b".
    - That command install a version from deepseek with 1.3 billions parameters. I choose this model because is fastest model from deepseek and i dont think necessary choose another model with more parameters. Does not require high computational cost.
    
    - IN CASE WITH PROBLEMS ABOUT SQLITE3. INSTALL IN SQLITE WEBSITE AND PUT SQLITE.DDL IN ANACONDA/DDL/
    - IS NECESSARY INSTALL CORS SUPPORT TO DJANGO WITH COMMAND "pip install django-cors-headers".
    - To prevent ollama from running the LLM model via CPU, in my case, i needed to install ollama via ollama-for-amd, a community repository. The entire tutorial is at this link: https://www.youtube.com/watch?v=G-kpvlvKM1g





