git add で既にステージングされた変更を基に、適切なコミットメッセージを生成してコミットしてください。

手順:

1. `git diff --cached --stat` と `git diff --cached` でステージング済みの差分を確認する
2. ステージングされた変更がない場合は、その旨を伝えて終了する
3. 機密ファイル（.env, credentials 等）がステージングされている場合は警告して確認を求める
4. 差分の内容を分析し、以下のルールに従ってコミットメッセージを生成する:
   - Conventional Commits 形式を使用: `<type>(scope): <description> #<Issue番号>`
   - type: feat, fix, refactor, docs, chore, test, style, ci のいずれか
   - scope: 変更対象の機能領域（省略可）
   - description: 変更の要約（英語、命令形）
   - 関連する Issue 番号がわかる場合は末尾に `#<番号>` を付与
   - 最大3行以内。基本的に1行で収める
   - 例: `feat(auth): add login page and Cognito authentication flow #3`
   - 例: `fix(api): correct cross-stack reference for UserPoolId #2`
5. 生成したコミットメッセージをユーザーに提示し、確認を求める
6. ユーザーが承認したら `git commit` を実行する
