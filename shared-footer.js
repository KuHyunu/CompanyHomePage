document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.gate-reference-footer')) return;
  const legacyFooter = document.querySelector('.legacy-footer');
  if (!legacyFooter) return;
  legacyFooter.insertAdjacentHTML('afterend', `
    <footer class="gate-reference-footer">
      <div class="gate-container">
        <div class="gate-reference-logo"><a href="index.html" aria-label="투비스마트 메인게이트"><img src="image/TobeSmartLogo.png" alt="TOBESMART" /></a></div>
        <div class="gate-reference-line" aria-hidden="true"></div>
        <div class="gate-reference-body">
          <div class="gate-reference-company"><p>대표: 김광 &nbsp;|&nbsp; 주소: 경기도 성남시 중원구 둔촌대로 484 시콕스타워 116/117호</p><p>전화: 1577-3119 &nbsp;|&nbsp; 팩스: 031-701-4119 &nbsp;|&nbsp; 이메일: tobesmart@tobesmart.co.kr</p><p class="gate-reference-copyright">COPYRIGHT © TOBESMART. ALL RIGHTS RESERVED.</p></div>
          <div class="gate-reference-center"><strong>고객센터</strong><p>전화 1577-3119 | <a href="https://pf.kakao.com/_FKGxnj" target="_blank" rel="noopener noreferrer">카카오톡 문의</a></p><p>평일 09:00 ~ 18:00</p></div>
        </div>
      </div>
    </footer>`);
});
