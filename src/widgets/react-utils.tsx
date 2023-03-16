import React, {ChangeEvent, ReactNode} from "react";

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

// TODO: this is kinda janky... wish there was an easy way to replicate
//  vue and svelte's binding e.g. <input v-model="someVariable" />
//  React is just so damn verbose...
export const bind = (value: string, handler: (v: string) => any, eventHandlerPropName = 'onChange', valuePropName = 'value') => {
    return {
        [eventHandlerPropName]: (ev: ChangeEvent<HTMLInputElement>) => {
            ev.preventDefault()
            handler(ev.target.value)
        },
        [valuePropName]: value

    }
}

/**
 *
 * @param conditionalClasses a map of class names to booleans indicating if they should be added
 * @param classes additional classes to add to the component
 */
function classes(conditionalClasses: { [p: string]: boolean }, classes: string = "") {
    return Object.entries(conditionalClasses)
        .filter((entry) => entry[1])
        .map((entry) => entry[0])
        .join(" ")
        .concat(" ")
        .concat(classes);
}