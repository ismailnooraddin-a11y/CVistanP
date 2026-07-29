'use client';
import { X, Search, Plus, SlidersHorizontal } from 'lucide-react';
export function PageHeader({title,subtitle,action,onAction}:{title:string;subtitle?:string;action?:string;onAction?:()=>void}){return <div className="page-head"><div><h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div>{action&&<button className="btn" onClick={onAction}><Plus size={18}/>{action}</button>}</div>}
export function Modal({title,onClose,children,wide=false}:{title:string;onClose:()=>void;children:React.ReactNode;wide?:boolean}){return <div className="overlay" onMouseDown={onClose}><div className={`modal ${wide?'wide':''}`} onMouseDown={e=>e.stopPropagation()}><div className="modal-head"><h2>{title}</h2><button className="icon-btn" onClick={onClose}><X/></button></div>{children}</div></div>}
export function SearchBar({value,onChange,placeholder='Search...'}:{value:string;onChange:(v:string)=>void;placeholder?:string}){return <div className="search"><Search size={18}/><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></div>}
export function FilterButton({open,onClick}:{open:boolean;onClick:()=>void}){return <button className={`btn secondary ${open?'selected':''}`} onClick={onClick}><SlidersHorizontal size={17}/>Filters</button>}
export function Empty({title,body}:{title:string;body:string}){return <div className="empty"><h3>{title}</h3><p>{body}</p></div>}
export function Status({children,tone='neutral'}:{children:React.ReactNode;tone?:'good'|'warn'|'bad'|'neutral'}){return <span className={`status ${tone}`}>{children}</span>}
