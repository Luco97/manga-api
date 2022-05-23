export const html_template: string = `<div
style="
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  box-sizing: border-box;
  border: 5px solid #000;
  border-radius: 15px;
  overflow: hidden;
"
>
<header style="padding: 2rem 2.5rem; background-color: #971b1f">
  <h1 style="margin: 0; text-align: center; color: #fff">
    Hello, {{ username }} !
  </h1>
</header>
<hr style="border: 10px solid rgba(0, 0, 0, 0.205); margin: 0" />
<section style="padding: 2rem 0 2rem 2rem">
  <p style="font-size: 1rem; margin: 0">
    This link is for account
    <span style="font-weight: 600">activation</span>:
    <a
      href="{{ domain }}/api/auth/email-verify/{{ guid }}"
      style="text-decoration: underline; color: #4b4bff"
      >Click here to active your accout!</a
    >
  </p>
</section>
<footer style="text-align: center">
  <img
    src="https://camo.githubusercontent.com/a37de148dc9e586059ce94c8fa735abbe870edada58147e4441de498f919a7e9/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f68696370636e776f782f696d6167652f75706c6f61642f76313635323531313135362f6d616e67612d6170692d6173736574732f4d617263612d6261636b67726f756e642d7265645f69696b7035392e706e67"
    alt="Mangas-App Logo image"
    width="200"
  />
</footer>
</div>`;
