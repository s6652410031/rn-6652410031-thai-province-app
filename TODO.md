# TODO: HomeScreen Phone Optimization

## Task: Adjust HomeScreen for better phone fit and remove English province name

### Steps:

- [x] 1. Analyze the HomeScreen.tsx code
- [x] 2. Remove "Uttaradit Province" English text from hero section
- [x] 3. Reduce hero section height for better phone fit (280 → 220)
- [x] 4. Reduce province seal size (150x150 → 110x110)
- [x] 5. Reduce font sizes for better phone readability
- [x] 6. Adjust padding and margins for compact phone layout
- [x] 7. Reduce info card sizes and icon containers
- [x] 8. Reduce highlight item sizes
- [x] 9. Reduce welcome section size

### Changes Summary:

1. Removed: `<Text style={styles.englishName}>Uttaradit Province</Text>`
2. Hero section: height 280 → 220
3. Province seal: 150x150 → 110x110
4. Province name font: 42 → 34
5. Section title font: 22 → 18
6. Various padding/margin reductions throughout
