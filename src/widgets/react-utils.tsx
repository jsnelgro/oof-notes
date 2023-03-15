import React, {ReactNode} from "react";

export const If: React.FunctionComponent<React.PropsWithChildren & {
    when: boolean
}> = (props) => {
    return <>{props.when ? props.children : null}</>
}

export const For = <T extends any>(props: { each: T[], children: (it: T) => ReactNode | undefined }) => <>
    {props.each.map(it => {
        return props.children(it)
    })}
</>;
