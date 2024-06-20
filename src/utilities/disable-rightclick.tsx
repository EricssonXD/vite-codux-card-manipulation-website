// disableRightClick.ts
document.addEventListener('contextmenu', (event: MouseEvent) => {
    event.preventDefault();
});