'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* ========================================================================
     1. CHẾ ĐỘ SÁNG / TỐI (DARK / LIGHT MODE)
     ======================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const body = document.body;

  // Lấy cấu hình theme đã lưu từ LocalStorage, mặc định là light
  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);

    if (theme === 'dark') {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    } else {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  /* ========================================================================
     2. MENU MOBILE (HAMBURGER TOGGLE)
     ======================================================================== */
  const menuToggleBtn = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const menuIcon = document.getElementById('menu-icon');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggleBtn && navMenu) {
    menuToggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuIcon.classList.toggle('fa-bars', !isOpen);
      menuIcon.classList.toggle('fa-xmark', isOpen);
    });

    // Tự động đóng menu khi bấm vào bất kỳ link điều hướng nào
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          menuIcon.classList.add('fa-bars');
          menuIcon.classList.remove('fa-xmark');
        }
      });
    });

    // Đóng menu khi nhấp chuột ra bên ngoài
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !menuToggleBtn.contains(e.target)) {
        navMenu.classList.remove('open');
        menuIcon.classList.add('fa-bars');
        menuIcon.classList.remove('fa-xmark');
      }
    });
  }

  /* ========================================================================
     3. HIỆU ỨNG GÕ CHỮ (TYPEWRITER EFFECT)
     ======================================================================== */
  const typewriterElement = document.getElementById('typewriter-text');
  if (typewriterElement) {
    const words = [
      "Sinh viên Công nghệ Thông tin",
      "Fresher Web Developer",
      "Người yêu thích lập trình Front-end",
      "Ứng viên sẵn sàng học hỏi & thực tập"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseTime = 1800;

    function typeEffect() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let timeoutDuration = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentWord.length) {
        // Đã gõ xong từ, dừng lại trước khi xóa
        timeoutDuration = pauseTime;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // Đã xóa hết, chuyển sang từ tiếp theo
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        timeoutDuration = 400;
      }

      setTimeout(typeEffect, timeoutDuration);
    }

    typeEffect();
  }

  /* ========================================================================
     4. THANH TIẾN TRÌNH CUỘN TRANG & ACTIVE NAVIGATION LINK
     ======================================================================== */
  const scrollProgress = document.getElementById('scroll-progress');
  const scrollTopBtn = document.getElementById('scroll-to-top');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    // Cập nhật thanh tiến trình
    if (scrollProgress && totalHeight > 0) {
      const progressPercent = (scrollY / totalHeight) * 100;
      scrollProgress.style.width = `${progressPercent}%`;
    }

    // Hiển thị/Ẩn nút Scroll to Top
    if (scrollTopBtn) {
      if (scrollY > 350) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    // Cập nhật menu link đang active theo vị trí scroll
    sections.forEach(currentSection => {
      const sectionHeight = currentSection.offsetHeight;
      const sectionTop = currentSection.offsetTop - 120;
      const sectionId = currentSection.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Sự kiện khi bấm nút Scroll to Top
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ========================================================================
     5. BỘ LỌC DỰ ÁN (PROJECT FILTER)
     ======================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Đổi class active cho nút bấm
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hide');
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  /* ========================================================================
     6. MODAL CHI TIẾT DỰ ÁN (PROJECT MODAL)
     ======================================================================== */
  const modalBackdrop = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDynamicContent = document.getElementById('modal-dynamic-content');
  const modalViewBtns = document.querySelectorAll('.btn-modal-view');

  // Dữ liệu chi tiết cho từng dự án
  const projectDetailsData = {
    jira: {
      title: 'Hệ Thống Quản Lý Jira và GitHub',
      subtitle: 'Đồ án tích hợp hệ thống & Tự động hóa quy trình CI/CD',
      imgSrc: 'images/project-jira.svg',
      description: 'Dự án nghiên cứu và hiện thực hóa luồng tích hợp dữ liệu liên tục giữa kho mã nguồn GitHub và công cụ quản lý dự án Jira Cloud. Khi lập trình viên thực hiện Commit hoặc tạo Pull Request trên GitHub, hệ thống tự động bắt tín hiệu Webhook và cập nhật trạng thái của Task trên Jira mà không cần can thiệp thủ công.',
      techStack: ['Java', 'Spring Boot', 'GitHub Webhooks', 'Jira REST API', 'Postman', 'Git'],
      highlights: [
        'Xây dựng endpoint RESTful API bảo mật bằng Spring Boot để tiếp nhận và phân tích cú pháp Payload JSON từ GitHub.',
        'Kết nối xác thực OAuth/API Token với Jira Cloud API để truy xuất và chuyển đổi trạng thái issue (To Do -> In Progress -> Done).',
        'Tự động ghi nhận Commit Message, Author, Timestamp và liên kết trực tiếp vào Jira issue log.',
        'Kiểm thử endpoint với Postman và xây dựng cơ chế xử lý lỗi (Exception Handler) đảm bảo server hoạt động ổn định khi mạng ngắt quãng.'
      ],
      githubUrl: 'https://github.com/NguyenHuong15'
    },
    remarket: {
      title: 'Website Mua Bán Đồ Cổ - ReMarket',
      subtitle: 'Nền tảng thương mại điện tử chuyên biệt cho cổ vật & vật phẩm độc bản',
      imgSrc: 'images/project-remarket.svg',
      description: 'ReMarket là nền tảng e-commerce hướng đến đối tượng yêu thích sưu tập đồ cổ, gốm sứ xưa và đồ đồng mỹ nghệ. Điểm thách thức cốt lõi là các sản phẩm cổ vật thường mang tính "độc bản" (chỉ có duy nhất 1 sản phẩm tồn kho), đòi hỏi cơ chế giữ hàng và kiểm tra đồng thời (concurrency control) chuẩn xác.',
      techStack: ['HTML5/CSS3', 'JavaScript ES6', 'Node.js / Express', 'MySQL', 'Bootstrap 5'],
      highlights: [
        'Thiết kế cơ sở dữ liệu quan hệ MySQL chuẩn hóa 3NF, lưu trữ thông tin phân loại theo niên đại lịch sử, xuất xứ và chất liệu.',
        'Xây dựng cơ chế khóa đơn hàng tạm thời (Locking mechanism) khi khách hàng bước vào bước thanh toán, ngăn ngừa tình trạng hai người cùng đặt mua một cổ vật độc bản.',
        'Giao diện thân thiện, tương thích tối đa trên thiết bị di động với Bootstrap 5 kết hợp tùy biến CSS.',
        'Chức năng giỏ hàng, tìm kiếm sản phẩm nâng cao và bộ lọc đa tiêu chí linh hoạt.'
      ],
      githubUrl: 'https://github.com/NguyenHuong15'
    },
    gym: {
      title: 'Website Đăng Ký Hội Viên Gym',
      subtitle: 'Ứng dụng quản lý thành viên & dịch vụ thể hình tối ưu trải nghiệm',
      imgSrc: 'images/project-gym.svg',
      description: 'Ứng dụng một trang (Single Page Web) hỗ trợ người dùng đăng ký thẻ tập gym trực tuyến, lựa chọn các gói dịch vụ (Standard, VIP, Platinum) cùng huấn luyện viên cá nhân (PT), đồng thời cung cấp giao diện quản trị viên quản lý danh sách hội viên.',
      techStack: ['HTML5 Semantic', 'CSS3 Modern Layout', 'JavaScript ES6+', 'LocalStorage Web API'],
      highlights: [
        'Xử lý logic hoàn toàn bằng JavaScript thuần không phụ thuộc thư viện nặng, tối ưu tốc độ tải trang.',
        'Lưu trữ và đồng bộ trạng thái dữ liệu tức thời thông qua LocalStorage API.',
        'Validation form đăng ký chặt chẽ: kiểm tra số điện thoại hợp lệ, ngày sinh và định dạng email.',
        'Bảng thống kê thành viên hỗ trợ tìm kiếm theo tên và lọc theo gói tập nhanh chóng.'
      ],
      githubUrl: 'https://github.com/NguyenHuong15'
    }
  };

  function openProjectModal(projectId) {
    const data = projectDetailsData[projectId];
    if (!data) return;

    modalDynamicContent.innerHTML = `
      <img src="${data.imgSrc}" alt="${data.title}" class="modal-header-img">
      <div class="modal-body">
        <h3 class="modal-title" id="modal-title">${data.title}</h3>
        <p class="modal-subtitle">${data.subtitle}</p>
        
        <h4 class="modal-section-title"><i class="fa-solid fa-align-left text-primary"></i> Tổng quan dự án</h4>
        <p class="modal-text">${data.description}</p>

        <h4 class="modal-section-title"><i class="fa-solid fa-layer-group text-primary"></i> Công nghệ sử dụng</h4>
        <div class="project-tech-stack">
          ${data.techStack.map(t => `<span class="tech-pill">${t}</span>`).join('')}
        </div>

        <h4 class="modal-section-title"><i class="fa-solid fa-star text-primary"></i> Tính năng nổi bật &amp; Giải pháp kỹ thuật</h4>
        <ul class="modal-bullets">
          ${data.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>

        <div class="modal-footer">
          <a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            <i class="fa-brands fa-github"></i> Xem Trên GitHub
          </a>
        </div>
      </div>
    `;

    modalBackdrop.classList.add('show');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Khóa cuộn trang nền
  }

  function closeProjectModal() {
    modalBackdrop.classList.remove('show');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Mở lại cuộn trang
  }

  modalViewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      openProjectModal(projectId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  // Đóng modal khi click vào vùng đen bên ngoài dialog
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeProjectModal();
      }
    });
  }

  // Đóng modal bằng phím ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('show')) {
      closeProjectModal();
    }
  });

  /* ========================================================================
     7. FORM LIÊN HỆ & KIỂM TRA HỢP LỆ DỮ LIỆU (VALIDATION)
     ======================================================================== */
  const contactForm = document.getElementById('contact-form');
  const inputName = document.getElementById('contact-name');
  const inputEmail = document.getElementById('contact-email');
  const inputSubject = document.getElementById('contact-subject');
  const inputMessage = document.getElementById('contact-message');

  const errorName = document.getElementById('name-error');
  const errorEmail = document.getElementById('email-error');
  const errorSubject = document.getElementById('subject-error');
  const errorMessage = document.getElementById('message-error');

  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toast-title');
  const toastMsg = document.getElementById('toast-msg');

  // Hàm hiển thị lỗi cho từng input
  function setError(input, errorElement, message) {
    const parentGroup = input.closest('.form-group');
    if (parentGroup) {
      parentGroup.classList.add('has-error');
    }
    errorElement.textContent = message;
  }

  // Hàm xóa lỗi khi người dùng nhập đúng
  function clearError(input, errorElement) {
    const parentGroup = input.closest('.form-group');
    if (parentGroup) {
      parentGroup.classList.remove('has-error');
    }
    errorElement.textContent = '';
  }

  // Kiểm tra biểu thức chính quy (Regex) của Email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  // Validation từng trường
  function validateName() {
    const val = inputName.value.trim();
    if (!val) {
      setError(inputName, errorName, 'Vui lòng nhập họ và tên của bạn.');
      return false;
    } else if (val.length < 2) {
      setError(inputName, errorName, 'Họ và tên cần tối thiểu 2 ký tự.');
      return false;
    }
    clearError(inputName, errorName);
    return true;
  }

  function validateEmail() {
    const val = inputEmail.value.trim();
    if (!val) {
      setError(inputEmail, errorEmail, 'Vui lòng nhập địa chỉ email.');
      return false;
    } else if (!isValidEmail(val)) {
      setError(inputEmail, errorEmail, 'Định dạng email chưa hợp lệ (VD: ten@domain.com).');
      return false;
    }
    clearError(inputEmail, errorEmail);
    return true;
  }

  function validateSubject() {
    const val = inputSubject.value.trim();
    if (!val) {
      setError(inputSubject, errorSubject, 'Vui lòng nhập tiêu đề liên hệ.');
      return false;
    } else if (val.length < 3) {
      setError(inputSubject, errorSubject, 'Tiêu đề cần tối thiểu 3 ký tự.');
      return false;
    }
    clearError(inputSubject, errorSubject);
    return true;
  }

  function validateMessage() {
    const val = inputMessage.value.trim();
    if (!val) {
      setError(inputMessage, errorMessage, 'Vui lòng nhập nội dung tin nhắn.');
      return false;
    } else if (val.length < 10) {
      setError(inputMessage, errorMessage, 'Nội dung tin nhắn cần tối thiểu 10 ký tự.');
      return false;
    }
    clearError(inputMessage, errorMessage);
    return true;
  }

  // Lắng nghe sự kiện blur & input để kiểm tra tức thời (Real-time feedback)
  if (inputName) {
    inputName.addEventListener('blur', validateName);
    inputName.addEventListener('input', () => { if (inputName.value.trim().length >= 2) clearError(inputName, errorName); });
  }

  if (inputEmail) {
    inputEmail.addEventListener('blur', validateEmail);
    inputEmail.addEventListener('input', () => { if (isValidEmail(inputEmail.value)) clearError(inputEmail, errorEmail); });
  }

  if (inputSubject) {
    inputSubject.addEventListener('blur', validateSubject);
    inputSubject.addEventListener('input', () => { if (inputSubject.value.trim().length >= 3) clearError(inputSubject, errorSubject); });
  }

  if (inputMessage) {
    inputMessage.addEventListener('blur', validateMessage);
    inputMessage.addEventListener('input', () => { if (inputMessage.value.trim().length >= 10) clearError(inputMessage, errorMessage); });
  }

  // Hàm hiển thị Toast thông báo
  function showToast(title, message) {
    if (!toast) return;
    toastTitle.textContent = title;
    toastMsg.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // Sự kiện gửi Form
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isSubjectValid = validateSubject();
      const isMessageValid = validateMessage();

      // Nếu tất cả các trường đều hợp lệ
      if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
        const submitBtn = document.getElementById('btn-submit');
        const originalContent = submitBtn.innerHTML;

        // Hiệu ứng đang gửi
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi tin nhắn...';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalContent;

          // Hiển thị thông báo thành công
          showToast('Gửi thành công! 🎉', 'Cảm ơn bạn đã liên hệ, mình sẽ phản hồi lại sớm nhất qua email.');

          // Xóa trắng form
          contactForm.reset();
        }, 800);
      } else {
        // Focus vào ô lỗi đầu tiên
        if (!isNameValid) inputName.focus();
        else if (!isEmailValid) inputEmail.focus();
        else if (!isSubjectValid) inputSubject.focus();
        else if (!isMessageValid) inputMessage.focus();
      }
    });
  }
});

