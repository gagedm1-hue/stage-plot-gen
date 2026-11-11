/** Shared bits for marking up a plot position, used by the editor and the
 *  read-only share view so the two always draw a player the same way. */

/** Where a power mark sits against the player it belongs to. */
export type PowerAt = 'front' | 'side';

/**
 * A power drop drawn against a player. Deliberately carries no voltage: the
 * supply is the venue's business (120 V in the US, 240 V in the UK/EU), so the
 * plot marks where the drop is needed and the engineer reads their own supply.
 */
export function PowerMark({ at }: { at: PowerAt }) {
  return (
    <span
      className={`absolute z-10 whitespace-nowrap rounded border border-amber-400/80 bg-slate-950 px-1 py-[1px] text-[9px] font-bold uppercase tracking-[0.08em] text-amber-300 print:border-black print:bg-white print:text-black ${
        at === 'front' ? 'left-1/2 -top-2.5 -translate-x-1/2' : 'top-1/2 -right-2.5 -translate-y-1/2'
      }`}
    >
      Power
    </span>
  );
}
