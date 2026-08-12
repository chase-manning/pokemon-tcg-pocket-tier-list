export const buildTiers = <T,>(items: T[], getScore: (item: T) => number) => {
    if (!items || items.length === 0) return [];
    const bestScore = getScore(items[0]);
    const worstScore = getScore(items[items.length - 1]);
    const steps = (bestScore - worstScore) / 6;

    return [
        { label: "S", color: "var(--s)", data: items.filter((d) => getScore(d) >= bestScore - steps) },
        { label: "A", color: "var(--a)", data: items.filter((d) => getScore(d) < bestScore - steps && getScore(d) >= bestScore - steps * 2) },
        { label: "B", color: "var(--b)", data: items.filter((d) => getScore(d) < bestScore - steps * 2 && getScore(d) >= bestScore - steps * 3) },
        { label: "C", color: "var(--c)", data: items.filter((d) => getScore(d) < bestScore - steps * 3 && getScore(d) >= bestScore - steps * 4) },
        { label: "D", color: "var(--d)", data: items.filter((d) => getScore(d) < bestScore - steps * 4 && getScore(d) >= bestScore - steps * 5) },
        { label: "E", color: "var(--e)", data: items.filter((d) => getScore(d) < bestScore - steps * 5) },
    ];
};