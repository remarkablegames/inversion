/**
 * GitHub Corners
 *
 * @see https://github.com/remarkablemark/github-corners
 */
if (import.meta.env.VITE_BUNDLE !== 'true') {
  const script = document.createElement('script');

  script.src = 'https://unpkg.com/github-corners/dist/embed.min.js';
  script.dataset.href = 'https://github.com/remarkablegames/inversion';
  script.dataset.target = '_blank';
  script.async = true;
  script.defer = true;

  document.head.appendChild(script);
}
